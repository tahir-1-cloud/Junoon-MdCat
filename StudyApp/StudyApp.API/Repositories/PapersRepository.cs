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




        public async Task<List<AssignedPaperDto>> GetAssignedPapersForStudent(int studentId)
        {
            
            var q = from ps in _context.PaperSessions
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
                        AvailableTo = null
                    };

            var list = await q.ToListAsync();

            var unique = list.GroupBy(x => x.Id).Select(g => g.First()).ToList();
            return unique;
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
    }
}
