using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class AttemptService : IAttemptService
    {
        private readonly IAttemptRepository _repo;
        private readonly ApplicationDbContext _ctx;
        private readonly ILogger<AttemptService> _logger;

        public AttemptService(IAttemptRepository repo, ApplicationDbContext ctx, ILogger<AttemptService> logger)
        {
            _repo = repo;
            _ctx = ctx;
            _logger = logger;
        }

        //public async Task<AttemptDto?> GetAttemptAsync(int attemptId, long studentId)
        //{
        //    return await _repo.GetAttemptDtoForStudentAsync(attemptId, studentId);
        //}
        public async Task<AttemptDto?> GetAttemptAsync(int attemptId)
        {
            return await _repo.GetAttemptDtoForStudentAsync(attemptId);
        }

        public async Task SaveAnswerAsync(SaveAnswerDto model, long studentId)
        {
            var attempt = await _repo.GetByIdAsync(model.AttemptId);
            if (attempt == null) throw new Exception("Attempt not found");
            if (attempt.StudentId != studentId) throw new Exception("Unauthorized");
            if (attempt.Status == "Completed") throw new Exception("Attempt already completed");

            var answer = new StudentAnswer
            {
                StudentAttemptId = model.AttemptId,
                QuestionId = model.QuestionId,
                SelectedOptionId = model.SelectedOptionId,
                IsMarkedForReview = model.MarkForReview ?? false,
                UpdatedAt = DateTime.UtcNow
            };

            await _repo.SaveAnswerAsync(answer);
        }

        public async Task CompleteAttemptAsync(CompleteAttemptDto model, long studentId)
        {
            var attempt = await _repo.GetByIdAsync(model.AttemptId);
            if (attempt == null) throw new Exception("Attempt not found");
            if (attempt.StudentId != studentId) throw new Exception("Unauthorized");
            if (attempt.Status == "Completed") throw new Exception("Already completed");

            var answers = await _repo.GetAnswersForAttemptAsync(model.AttemptId);
            decimal totalCorrect = 0M;
            foreach (var a in answers)
            {
                if (!a.SelectedOptionId.HasValue) continue;
                var opt = await _ctx.Options.FirstOrDefaultAsync(o => o.Id == a.SelectedOptionId.Value);
                if (opt != null && opt.IsCorrect)
                    totalCorrect += 1M;
            }

            var paper = await _ctx.Papers.Include(p => p.Questions).FirstOrDefaultAsync(p => p.Id == attempt.PaperId);
            int totalQuestions = paper?.Questions?.Count ?? 1;
            decimal scorePercent = (totalCorrect / totalQuestions) * 100M;

            attempt.Score = scorePercent;
            attempt.Status = "Completed";
            attempt.CompletedAt = DateTime.UtcNow;
            attempt.IsDeleted = attempt.IsDeleted;
            await _repo.UpdateAttemptAsync(attempt);
        }

        public async Task<bool> TryJoinAttemptAsync(int attemptId, long studentId, string connectionId)
        {
            var attempt = await _repo.GetByIdAsync(attemptId);
            if (attempt == null || attempt.StudentId != studentId) return false;
            if (attempt.Status == "Completed") return false;

            if (!attempt.StartedAt.HasValue)
            {
                attempt.StartedAt = DateTime.UtcNow;
            }
            await _repo.UpdateAttemptAsync(attempt);
            return true;
        }

        public async Task LeaveAttemptAsync(int attemptId, string connectionId)
        {
            var attempt = await _repo.GetByIdAsync(attemptId);
            if (attempt == null) return;
            await _repo.UpdateAttemptAsync(attempt);
        }

        public async Task RegisterHeartbeatAsync(int attemptId, string connectionId)
        {
            await Task.CompletedTask;
        }

        public async Task NotifyForceJoinAsync(int attemptId, long studentId, string connectionId)
        {
            var attempt = await _repo.GetByIdAsync(attemptId);
            if (attempt == null)
            {
                _logger.LogWarning("NotifyForceJoinAsync: attempt {AttemptId} not found (student {StudentId}, conn {Conn})", attemptId, studentId, connectionId);
                return;
            }

            _logger.LogInformation("NotifyForceJoinAsync: attempt {AttemptId} force-joined by student {StudentId} via connection {Conn} at {Time}",
                attemptId, studentId, connectionId, DateTime.UtcNow);

            var updatedAtProp = attempt.GetType().GetProperty("UpdatedAt");
            if (updatedAtProp != null && updatedAtProp.CanWrite)
            {
                try
                {
                    updatedAtProp.SetValue(attempt, DateTime.UtcNow);
                    await _repo.UpdateAttemptAsync(attempt);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to persist UpdatedAt for attempt {AttemptId} during force-join logging", attemptId);
                }
            }
        }
    }
}
