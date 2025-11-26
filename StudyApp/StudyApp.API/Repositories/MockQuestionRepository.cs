using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class MockQuestionRepository : BaseRepository<MockQuestion>, IMockQuestionRepository
    {
        public MockQuestionRepository(ApplicationDbContext context) : base(context)
        {
        }
        public async Task<MockQuestion> AddMockQuestionWithOptionsAsync(MockQuestion question)
        {
            _context.Set<MockQuestion>().Add(question);
            await _context.SaveChangesAsync();
            return question;
        }
        public async Task<List<MockQuestion>> GetMockQuestionsByPaperIdAsync(int MockpaperId)
        {
            return await _context.Set<MockQuestion>()
                .Where(q => q.MockTestId == MockpaperId)
                .Include(q => q.MockOptions)
                .ToListAsync();
        }
    }
}
