using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

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
    }
}
