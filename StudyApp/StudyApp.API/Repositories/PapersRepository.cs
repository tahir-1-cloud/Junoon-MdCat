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
    }
}
