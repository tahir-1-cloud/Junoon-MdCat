using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using StudyApp.API.Services;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Hubs
{
    public class AttemptHub : Hub
    {
        // in-memory map: attemptId -> connectionId
        private static readonly ConcurrentDictionary<int, string> ActiveAttempts = new();

        private readonly IAttemptService _attemptService;

        public AttemptHub(IAttemptService attemptService)
        {
            _attemptService = attemptService;
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var existing = ActiveAttempts.FirstOrDefault(kv => kv.Value == Context.ConnectionId);
            if (!existing.Equals(default(KeyValuePair<int, string>)))
            {
                ActiveAttempts.TryRemove(existing.Key, out _);
                await _attemptService.LeaveAttemptAsync(existing.Key, Context.ConnectionId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task<bool> JoinAttempt(int attemptId, long studentId)
        {
            // ask service if join is allowed
            var allowed = await _attemptService.TryJoinAttemptAsync(attemptId, studentId, Context.ConnectionId);
            if (!allowed)
            {
                // reject immediately
                return false;
            }

            // enforce single in-memory session: if another connection exists, notify and reject/force disconnect existing
            if (ActiveAttempts.TryGetValue(attemptId, out var existingConnectionId))
            {
                if (existingConnectionId != Context.ConnectionId)
                {
                    // Option 1: reject this join
                    // return false;

                    // Option 2: force disconnect previous and accept this one:
                    await Clients.Client(existingConnectionId).SendAsync("ForceDisconnect", "Another session has joined this attempt.");
                    ActiveAttempts[attemptId] = Context.ConnectionId;
                }
            }
            else
            {
                ActiveAttempts.TryAdd(attemptId, Context.ConnectionId);
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, $"Attempt-{attemptId}");
            // optional: register heartbeat now
            await _attemptService.RegisterHeartbeatAsync(attemptId, Context.ConnectionId);
            return true;
        }

        public async Task LeaveAttempt(int attemptId)
        {
            ActiveAttempts.TryRemove(attemptId, out _);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Attempt-{attemptId}");
            await _attemptService.LeaveAttemptAsync(attemptId, Context.ConnectionId);
        }

        public async Task Heartbeat(int attemptId)
        {
            // small keepalive called by client every 10s
            await _attemptService.RegisterHeartbeatAsync(attemptId, Context.ConnectionId);
        }

        // admin helper
        public async Task ForceDisconnect(string connectionId)
        {
            await Clients.Client(connectionId).SendAsync("ForceDisconnect", "Disconnected by server");
        }
    }
}
