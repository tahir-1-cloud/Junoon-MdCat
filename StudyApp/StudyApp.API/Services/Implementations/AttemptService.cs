using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Dto;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
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

        public async Task<AttemptResultDto?> GetAttemptResultAsync(int attemptId, long requestingStudentId)
        {
            var attemptEntity = await _repo.GetAttemptWithQuestionsAsync(attemptId);
            if (attemptEntity == null) return null;

            if (attemptEntity.StudentId != requestingStudentId)
            {
                throw new UnauthorizedAccessException("Not authorized for this attempt.");
            }

            var dto = new AttemptResultDto
            {
                AttemptId = attemptEntity.AttemptId,
                StudentId = attemptEntity.StudentId,
                Status = attemptEntity.Status,
                DurationMinutes = attemptEntity.DurationMinutes,
                AttemptedOn = attemptEntity.AttemptedOn
            };

            int total = 0;
            int correct = 0;
            var qList = new List<QuestionResultDto>();

            foreach (var q in attemptEntity.Questions.OrderBy(qe => qe.Order ?? 0))
            {
                var qDto = new QuestionResultDto
                {
                    QuestionId = q.QuestionId,
                    Title = q.Title,
                    Explanation = q.Explanation
                };

                var savedAnswer = attemptEntity.SavedAnswers?.FirstOrDefault(sa => sa.QuestionId == q.QuestionId);
                int? userOptionId = savedAnswer?.SelectedOptionId;
                qDto.UserOptionId = userOptionId;

                foreach (var opt in q.Options.OrderBy(o => o.Order ?? 0))
                {
                    qDto.Options.Add(new OptionResultDto
                    {
                        Id = opt.OptionId,
                        OptionText = opt.OptionText,
                        IsCorrect = opt.IsCorrect
                    });
                }

                var correctOption = qDto.Options.FirstOrDefault(o => o.IsCorrect);
                bool isCorrect = correctOption != null && userOptionId.HasValue && userOptionId.Value == correctOption.Id;

                total++;
                if (isCorrect) correct++;

                qList.Add(qDto);
            }

            dto.Questions = qList;
            dto.Total = total;
            dto.Correct = correct;
            dto.Percentage = total > 0 ? (int)Math.Round((double)correct / total * 100) : 0;

            return dto;
        }

        public async Task<List<AttemptListItemDto>> GetAttemptsForStudentAsync(long studentId)
        {
            var attempts = await _repo.GetAttemptsForStudentAsync(studentId);

            // Map repository projection → DTO
            return attempts.Select(a => new AttemptListItemDto
            {
                AttemptId = a.AttemptId,
                PaperId = a.PaperId,
                PaperTitle = a.PaperTitle,
                AttemptedOn = a.AttemptedOn,
                Status = a.Status,
                Correct = a.Correct,
                Total = a.Total,
                Percentage = a.Total > 0
                    ? (int)Math.Round((double)a.Correct / a.Total * 100)
                    : 0
            }).ToList();
        }
    }
}
