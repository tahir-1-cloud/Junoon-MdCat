using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;

namespace StudyApp.API.Repositories
{
    public class PapersRepository : BaseRepository<Paper>, IPapersRepository
    {
        public PapersRepository(ApplicationDbContext context) : base(context)
        {
        }
        public async Task<Paper?> GetPaperWithQuestions(int paperId)
        {
            Paper? paper = await _context.Papers
                .Include(p => p.Questions)
                    .ThenInclude(q => q.Options)
                .Include(p => p.PaperSessions)   // NEW
                .FirstOrDefaultAsync(p => p.Id == paperId);

            return paper;
        }

        public async Task<PaperSession?> GetPaperSession(int paperId, int sessionId)
        {
            return await _context.PaperSessions
                .FirstOrDefaultAsync(x => x.PaperId == paperId && x.SessionId == sessionId);
        }

        public async Task DeletePaperAsync(int paperId)
        {
            var paper = await _context.Papers
                .Include(p => p.Questions)
                    .ThenInclude(q => q.Options)
                .Include(p => p.PaperSessions)
                .Include(p => p.Attempts)
                .FirstOrDefaultAsync(p => p.Id == paperId);

            if (paper == null)
            {
                throw new KeyNotFoundException($"Paper with id {paperId} not found.");
            }

            _context.Papers.Remove(paper);
            await _context.SaveChangesAsync();
        }

        public async Task AssignPaperToSessionAsync(int paperId, int sessionId)
        {
            var paperExists = await _context.Papers.AnyAsync(p => p.Id == paperId);
            if (!paperExists) throw new KeyNotFoundException($"Paper with id {paperId} not found.");

            var sessionExists = await _context.Sessions.AnyAsync(s => s.Id == sessionId);
            if (!sessionExists) throw new KeyNotFoundException($"Session with id {sessionId} not found.");

            // check existing link
            var exists = await _context.PaperSessions
                .AnyAsync(ps => ps.PaperId == paperId && ps.SessionId == sessionId);

            if (exists) return;

            var link = new PaperSession
            {
                PaperId = paperId,
                SessionId = sessionId,
                AssignedOn = DateTime.UtcNow
            };

            _context.PaperSessions.Add(link);
            await _context.SaveChangesAsync();
        }

        public async Task RemovePaperSession(PaperSession entry)
        {
            _context.PaperSessions.Remove(entry);
            await _context.SaveChangesAsync();
        }




        //public async Task<List<AssignedPaperDto>> GetAssignedPapersForStudent(int studentId)
        //{

        //    var q = from ps in _context.PaperSessions
        //            join p in _context.Papers on ps.PaperId equals p.Id
        //            join s in _context.Sessions on ps.SessionId equals s.Id
        //            select new AssignedPaperDto
        //            {
        //                Id = p.Id,
        //                Title = p.Title,
        //                TestConductedOn = p.TestConductedOn,
        //                SessionId = s.Id,
        //                SessionTitle = s.Title,
        //                AvailableFrom = null,
        //                AvailableTo = null
        //            };

        //    var list = await q.ToListAsync();

        //    var unique = list.GroupBy(x => x.Id).Select(g => g.First()).ToList();
        //    return unique;
        //}

        public async Task<List<AssignedPaperDto>> GetAssignedPapersForStudent(int studentId)
        {
            var attemptedPaperIds = await _context.StudentAttempts
                .Where(a => a.StudentId == studentId)
                .Select(a => a.PaperId)
                .ToListAsync();

            var q =
                from ps in _context.PaperSessions
                join p in _context.Papers on ps.PaperId equals p.Id
                join s in _context.Sessions on ps.SessionId equals s.Id
                select new AssignedPaperDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    TestConductedOn = p.TestConductedOn,
                    SessionId = s.Id,
                    SessionTitle = s.Title,
                    AvailableFrom = null,
                    AvailableTo = null,

                    IsAttempted = attemptedPaperIds.Contains(p.Id)
                };

            var list = await q.ToListAsync();

            return list
                .GroupBy(x => x.Id)
                .Select(g => g.First())
                .ToList();
        }


        public async Task<List<StudentAttemptDto>> GetAttemptsForStudent(int studentId)
        {
            return await _context.StudentAttempts
                .Where(a => a.StudentId == studentId)
                .Select(a => new StudentAttemptDto
                {
                    Id = a.Id,
                    PaperId = a.PaperId,
                    StudentId = (int)a.StudentId,
                    Status = a.Status,
                    StartedAt = a.StartedAt,
                    CompletedAt = a.CompletedAt,
                    Score = a.Score
                })
                .ToListAsync();
        }

        public async Task<bool> IsPaperAssignedToAnySession(int paperId)
        {
            return await _context.PaperSessions.AnyAsync(ps => ps.PaperId == paperId);
        }

        public async Task<StudentAttempt?> GetInProgressAttempt(int paperId, int studentId)
        {
            return await _context.StudentAttempts
                .FirstOrDefaultAsync(a => a.PaperId == paperId && a.StudentId == studentId && a.Status == "InProgress");
        }

        public async Task<StudentAttempt?> GetCompletedAttempt(int paperId, int studentId)
        {
            return await _context.StudentAttempts
                .FirstOrDefaultAsync(a => a.PaperId == paperId && a.StudentId == studentId && a.Status == "Completed");
        }

        public async Task AddAttempt(StudentAttempt attempt)
        {
            _context.StudentAttempts.Add(attempt);
            await _context.SaveChangesAsync();
        }

        public async Task<StudentAttemptDto?> GetAttemptById(int attemptId)
        {
            var a = await _context.StudentAttempts.FindAsync(attemptId);
            if (a == null) return null;
            return new StudentAttemptDto
            {
                Id = a.Id,
                PaperId = a.PaperId,
                StudentId = (int)a.StudentId,
                Status = a.Status,
                StartedAt = a.StartedAt,
                CompletedAt = a.CompletedAt,
                Score = a.Score
            };
        }

        public async Task<StudentPaperDto?> GetStudentPaperAsync(int paperId)
        {
            long studentId = 3; // TEMP (replace with auth later)

            IQueryable<Paper> paperQuery =
                _context.Papers
                    .AsNoTracking() // ✅ read-only
                    .Where(p => p.Id == paperId)
                    .Include(p => p.Questions)
                        .ThenInclude(q => q.Options);

            var paperType = typeof(Paper);
            var hasPaperSessionsNav = paperType.GetProperty("PaperSessions") != null;

            if (hasPaperSessionsNav)
            {
                paperQuery = paperQuery.Include(p => p.PaperSessions);
            }

            var paper = await paperQuery.FirstOrDefaultAsync();
            if (paper == null) return null;

            // ✅ AsNoTracking – existence check only
            var isAttempted = await _context.StudentAttempts
                .AsNoTracking()
                .AnyAsync(a =>
                    a.PaperId == paperId &&
                    a.StudentId == studentId &&
                    a.Status == "Completed" &&
                    !a.IsDeleted
                );

            var dto = new StudentPaperDto
            {
                Id = paper.Id,
                Title = paper.Title ?? string.Empty,
                TestConductedOn = paper.TestConductedOn,
                DurationMinutes = paper.DurationMinutes,
                AvailableFrom = null,
                AvailableTo = null,

                // ✅ key flag
                IsAttempted = isAttempted,

                Questions = paper.Questions.Select(q => new StudentQuestionDto
                {
                    Id = q.Id,
                    Title = q.Title ?? string.Empty,
                    Description = q.Description,
                    Options = q.Options.Select(o => new StudentOptionDto
                    {
                        Id = o.Id,
                        OptionText = o.OptionText ?? string.Empty,
                        IsCorrect = null
                    }).ToList()
                }).ToList()
            };

            if (hasPaperSessionsNav && paper.PaperSessions != null)
            {
                dto.PaperSessions = new List<StudentPaperSessionDto>();

                foreach (var ps in paper.PaperSessions)
                {
                    dto.PaperSessions.Add(new StudentPaperSessionDto
                    {
                        PaperId = ps.PaperId,
                        SessionId = ps.SessionId,
                        SessionTitle = ps.Session?.Title
                    });
                }

                var first = dto.PaperSessions.FirstOrDefault();
                if (first != null)
                {
                    dto.SessionId = first.SessionId;
                    dto.SessionTitle = first.SessionTitle;
                }

                // ✅ fill missing titles (still read-only)
                var missingSessionIds = dto.PaperSessions
                    .Where(ps => ps.SessionId > 0 && string.IsNullOrEmpty(ps.SessionTitle))
                    .Select(ps => ps.SessionId)
                    .Distinct()
                    .ToList();

                if (missingSessionIds.Count > 0)
                {
                    var sessions = await _context.Sessions
                        .AsNoTracking() // ✅ read-only
                        .Where(s => missingSessionIds.Contains(s.Id))
                        .Select(s => new { s.Id, s.Title })
                        .ToListAsync();

                    var lookup = sessions.ToDictionary(s => s.Id, s => s.Title);

                    foreach (var ps in dto.PaperSessions)
                    {
                        if (string.IsNullOrEmpty(ps.SessionTitle) &&
                            lookup.TryGetValue(ps.SessionId, out var title))
                        {
                            ps.SessionTitle = title;
                        }
                    }
                }
            }

            return dto;
        }



    }
}
