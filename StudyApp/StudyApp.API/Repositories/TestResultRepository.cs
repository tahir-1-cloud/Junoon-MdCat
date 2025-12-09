using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using static System.Net.Mime.MediaTypeNames;

namespace StudyApp.API.Repositories
{
    public class TestResultRepository:BaseRepository<TestResult>, ITestResultRepository
    {
        public TestResultRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<TestResult>> GetResultsByTestIdAsync(int mockTestId)
        {
            return await _context.TestResults
                .Where(r => r.MockTestId == mockTestId)
                .ToListAsync();
        }

        public async Task<TestResult> GetMockResultWithDetailsAsync(int mockTestresultId)
        {
            var result =await _context.TestResults
                         .Include(r => r.TestResultAnswers)
                          .ThenInclude(a => a.Question)
                          .ThenInclude(q => q.MockOptions)
                         .FirstOrDefaultAsync(r => r.Id == mockTestresultId);

            if (result == null)
                throw new KeyNotFoundException($"result {mockTestresultId} not found.");

            return result;
        }
    }
}
