using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;
using StudyApp.API.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StudyApp.API.Dto;

namespace StudyApp.API.Repositories
{
    public class AttemptRepository : BaseRepository<StudentAttempt>, IAttemptRepository
    {
        public AttemptRepository(ApplicationDbContext context) : base(context)
        {
        }
        public async Task<StudentAttempt?> GetByIdAsync(int attemptId)
        {
            return await _context.StudentAttempts
                .Include(a => a.Paper)
                .FirstOrDefaultAsync(a => a.Id == attemptId && !a.IsDeleted);
        }

        //public async Task<AttemptDto?> GetAttemptDtoForStudentAsync(int attemptId, long studentId)
        //{
        //    var attempt = await _context.StudentAttempts
        //        .FirstOrDefaultAsync(a => a.Id == attemptId && a.StudentId == studentId && !a.IsDeleted);

        //    if (attempt == null)
        //        return null;

        //    var paper = await _context.Papers
        //        .Where(p => p.Id == attempt.PaperId && !p.IsDeleted)
        //        .Include(p => p.Questions.Where(q => !q.IsDeleted))
        //            .ThenInclude(q => q.Options.Where(o => !o.IsDeleted))
        //        .FirstOrDefaultAsync();

        //    var dto = new AttemptDto
        //    {
        //        Id = attempt.Id,
        //        PaperId = attempt.PaperId,
        //        StudentId = attempt.StudentId,
        //        AttemptedOn = attempt.AttemptedOn,
        //        StartedAt = attempt.StartedAt,
        //        CompletedAt = attempt.CompletedAt,
        //        Status = attempt.Status ?? "NotStarted",
        //        Score = attempt.Score,
        //        DurationMinutes = paper != null ? (paper.DurationMinutes) : 60,
        //        Questions = new List<QuestionForAttemptDto>()
        //    };

        //    if (paper?.Questions != null)
        //    {
        //        foreach (var q in paper.Questions.OrderBy(q => q.Order))
        //        {
        //            var qDto = new QuestionForAttemptDto
        //            {
        //                QuestionId = q.Id,
        //                Title = q.Title ?? string.Empty,
        //                Options = q.Options?.Select(o => new AttemptOptionDto
        //                {
        //                    Id = o.Id,
        //                    OptionText = o.OptionText ?? string.Empty
        //                }).ToList() ?? new List<AttemptOptionDto>()
        //            };

        //            dto.Questions.Add(qDto);
        //        }
        //    }


        //    return dto;
        //}
        public async Task<AttemptDto?> GetAttemptDtoForStudentAsync(int attemptId)
        {
            var attempt = await _context.StudentAttempts
                .FirstOrDefaultAsync(a => a.Id == attemptId && !a.IsDeleted);

            if (attempt == null)
                return null;

            var paper = await _context.Papers
                .Where(p => p.Id == attempt.PaperId && !p.IsDeleted)
                .Include(p => p.Questions.Where(q => !q.IsDeleted))
                    .ThenInclude(q => q.Options.Where(o => !o.IsDeleted))
                .FirstOrDefaultAsync();

            var dto = new AttemptDto
            {
                Id = attempt.Id,
                PaperId = attempt.PaperId,
                StudentId = attempt.StudentId,
                AttemptedOn = attempt.AttemptedOn,
                StartedAt = attempt.StartedAt,
                CompletedAt = attempt.CompletedAt,
                Status = attempt.Status ?? "NotStarted",
                Score = attempt.Score,
                DurationMinutes = paper != null ? (paper.DurationMinutes) : 60,
                Questions = new List<QuestionForAttemptDto>()
            };

            if (paper?.Questions != null)
            {
                foreach (var q in paper.Questions.OrderBy(q => q.Order))
                {
                    var qDto = new QuestionForAttemptDto
                    {
                        QuestionId = q.Id,
                        Title = q.Title ?? string.Empty,
                        Options = q.Options?.Select(o => new AttemptOptionDto
                        {
                            Id = o.Id,
                            OptionText = o.OptionText ?? string.Empty
                        }).ToList() ?? new List<AttemptOptionDto>()
                    };

                    dto.Questions.Add(qDto);
                }
            }


            return dto;
        }
        public async Task<List<QuestionForAttemptDto>> GetQuestionsForAttemptAsync(int attemptId)
        {
            var attempt = await _context.StudentAttempts.FirstOrDefaultAsync(a => a.Id == attemptId && !a.IsDeleted);
            if (attempt == null) return new List<QuestionForAttemptDto>();

            var paper = await _context.Papers
                .Where(p => p.Id == attempt.PaperId && !p.IsDeleted)
                .Include(p => p.Questions.Where(q => !q.IsDeleted))
                    .ThenInclude(q => q.Options.Where(o => !o.IsDeleted))
                .FirstOrDefaultAsync();

            if (paper == null) return new List<QuestionForAttemptDto>();

            var result = paper.Questions
                .OrderBy(q => q.Order)
                .Select(q => new QuestionForAttemptDto
                {
                    QuestionId = q.Id,
                    Title = q.Title ?? string.Empty,
                    Options = q.Options?.Select(o => new AttemptOptionDto
                    {
                        Id = o.Id,
                        OptionText = o.OptionText ?? string.Empty
                    }).ToList() ?? new List<AttemptOptionDto>()
                })
                .ToList();

            return result;
        }

        public async Task SaveAnswerAsync(StudentAnswer answer)
        {
            if (answer == null) throw new ArgumentNullException(nameof(answer));

            var existing = await _context.StudentAnswers
                .FirstOrDefaultAsync(a => a.StudentAttemptId == answer.StudentAttemptId && a.QuestionId == answer.QuestionId && !a.IsDeleted);

            if (existing == null)
            {
                answer.UpdatedAt = DateTime.UtcNow;
                _context.StudentAnswers.Add(answer);
            }
            else
            {
                existing.SelectedOptionId = answer.SelectedOptionId;
                existing.IsMarkedForReview = answer.IsMarkedForReview;
                existing.UpdatedAt = DateTime.UtcNow;
                _context.StudentAnswers.Update(existing);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<StudentAnswer>> GetAnswersForAttemptAsync(int attemptId)
        {
            return await _context.StudentAnswers
                .Where(a => a.StudentAttemptId == attemptId && !a.IsDeleted)
                .ToListAsync();
        }

        public async Task UpdateAttemptAsync(StudentAttempt attempt)
        {
            if (attempt == null) throw new ArgumentNullException(nameof(attempt));

            attempt.UpdatedAt = DateTime.UtcNow;

            _context.StudentAttempts.Update(attempt);
            await _context.SaveChangesAsync();
        }


        public async Task<AttemptEntity?> GetAttemptWithQuestionsAsync(int attemptId)
        {
            var attempt = await _context.StudentAttempts
                .Where(a => a.Id == attemptId)
                .Select(a => new AttemptEntity
                {
                    AttemptId = a.Id,
                    StudentId = a.StudentId,
                    Status = a.Status,
                    DurationMinutes = a.Paper.DurationMinutes,
                    AttemptedOn = a.AttemptedOn,

                    // Saved answers
                    SavedAnswers = _context.StudentAnswers
                        .Where(sa => sa.StudentAttemptId == a.Id)
                        .Select(sa => new SavedAnswerEntity
                        {
                            QuestionId = sa.QuestionId,
                            SelectedOptionId = sa.SelectedOptionId
                        })
                        .ToList(),

                    // Paper questions
                    Questions = a.Paper.Questions
                        .Select(q => new QuestionEntity
                        {
                            QuestionId = q.Id,
                            Title = q.Title,
                            Explanation = q.Description,

                            // Options inside each question
                            Options = q.Options
                                .Select(o => new OptionEntity
                                {
                                    OptionId = o.Id,
                                    OptionText = o.OptionText,
                                    IsCorrect = o.IsCorrect
                                })
                                .ToList()
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            return attempt;
        }


    }
}
