using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Dto;

namespace StudyApp.API.Repositories
{
    public class MockRepository:BaseRepository<MockTest>, IMockRepository
    {
        public MockRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<MockTestSummaryDto>> GetAllMockTestsAsync()
        {
            return await _context.MockTests
                .Select(x => new MockTestSummaryDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    TotalQuestions = x.MockQuestions.Count
                })
                .ToListAsync();
        }

        public async Task<MockTest> GetMockTestWithQuestionsAsync(int id)
        {

            var test = await _context.MockTests
                    .Include(x => x.MockQuestions)
                    .ThenInclude(q => q.MockOptions)
                    .FirstOrDefaultAsync(x => x.Id == id);

            if (test == null)
                throw new KeyNotFoundException($"Mock test {id} not found.");

            return test;

        }
    }
}
