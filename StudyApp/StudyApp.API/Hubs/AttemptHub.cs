// AttemptHub.cs
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Hubs
{
    public class AttemptHub : Hub
    {
        private static readonly ConcurrentDictionary<int, string> ActiveAttempts = new();
        private readonly IAttemptService _attemptService;
        private readonly ILogger<AttemptHub> _logger;

        public AttemptHub(IAttemptService attemptService, ILogger<AttemptHub> logger)
        {
            _attemptService = attemptService;
            _logger = logger;
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            try
            {
                var existing = ActiveAttempts.FirstOrDefault(kv => kv.Value == Context.ConnectionId);
                if (!existing.Equals(default(KeyValuePair<int, string>)))
                {
                    ActiveAttempts.TryRemove(existing.Key, out _);
                    await _attemptService.LeaveAttemptAsync(existing.Key, Context.ConnectionId);
                    _logger.LogInformation("Removed stale mapping for attempt {AttemptId} on disconnect", existing.Key);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in OnDisconnectedAsync");
            }

            await base.OnDisconnectedAsync(exception);
        }

        // Old JoinAttempt returned bool — now return an object with reason to show in UI
        public async Task<object> JoinAttempt(int attemptId, long studentId)
        {
            try
            {
                _logger.LogInformation("JoinAttempt called attempt={AttemptId} student={StudentId} conn={ConnId}",
                    attemptId, studentId, Context.ConnectionId);

                // ask service if join is allowed (business rule)
                var allowed = await _attemptService.TryJoinAttemptAsync(attemptId, studentId, Context.ConnectionId);

                // If attempt service disallows, return reason.
                if (!allowed)
                {
                    _logger.LogInformation("TryJoinAttemptAsync denied join attempt {AttemptId} for student {StudentId}", attemptId, studentId);
                    return new { ok = false, reason = "Another active session exists or admin blocked reattempt" };
                }

                // Manage in-memory active session (force previous or add)
                if (ActiveAttempts.TryGetValue(attemptId, out var existingConnectionId))
                {
                    if (existingConnectionId != Context.ConnectionId)
                    {
                        _logger.LogInformation("Forcing disconnect of previous connection {ExistingConn} for attempt {AttemptId}", existingConnectionId, attemptId);
                        await Clients.Client(existingConnectionId).SendAsync("ForceDisconnect", "Another session has joined this attempt.");
                        ActiveAttempts[attemptId] = Context.ConnectionId;
                    }
                }
                else
                {
                    ActiveAttempts.TryAdd(attemptId, Context.ConnectionId);
                }

                await Groups.AddToGroupAsync(Context.ConnectionId, $"Attempt-{attemptId}");
                await _attemptService.RegisterHeartbeatAsync(attemptId, Context.ConnectionId);
                return new { ok = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during JoinAttempt attemptId={AttemptId}", attemptId);
                return new { ok = false, reason = "Server error" };
            }
        }

        // Force join API: if client explicitly requests it the server will disconnect previous and accept new
        public async Task<object> ForceJoinAttempt(int attemptId, long studentId)
        {
            try
            {
                _logger.LogInformation("ForceJoinAttempt attempt={AttemptId} student={StudentId} conn={ConnId}",
                    attemptId, studentId, Context.ConnectionId);

                // If there is a previous connection, tell it to disconnect.
                if (ActiveAttempts.TryGetValue(attemptId, out var existingConnectionId))
                {
                    if (existingConnectionId != Context.ConnectionId)
                    {
                        await Clients.Client(existingConnectionId).SendAsync("ForceDisconnect", "Another session has forced a takeover.");
                        ActiveAttempts[attemptId] = Context.ConnectionId;
                    }
                }
                else
                {
                    ActiveAttempts.TryAdd(attemptId, Context.ConnectionId);
                }

                await Groups.AddToGroupAsync(Context.ConnectionId, $"Attempt-{attemptId}");
                await _attemptService.RegisterHeartbeatAsync(attemptId, Context.ConnectionId);
                await _attemptService.NotifyForceJoinAsync(attemptId, studentId, Context.ConnectionId);

                return new { ok = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ForceJoinAttempt error attemptId={AttemptId}", attemptId);
                return new { ok = false, reason = "Server error" };
            }
        }

        public async Task LeaveAttempt(int attemptId)
        {
            try
            {
                ActiveAttempts.TryRemove(attemptId, out _);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Attempt-{attemptId}");
                await _attemptService.LeaveAttemptAsync(attemptId, Context.ConnectionId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "LeaveAttempt error attemptId={AttemptId}", attemptId);
            }
        }

        public async Task Heartbeat(int attemptId)
        {
            try
            {
                await _attemptService.RegisterHeartbeatAsync(attemptId, Context.ConnectionId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Heartbeat error attemptId={AttemptId}", attemptId);
            }
        }
    }
}
