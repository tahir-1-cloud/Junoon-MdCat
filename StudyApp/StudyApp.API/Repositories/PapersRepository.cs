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
                .FirstOrDefaultAsync(p => p.Id == paperId);

            return paper;
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
    }
}
