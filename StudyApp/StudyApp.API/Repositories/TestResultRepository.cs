using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using System.Text.RegularExpressions;
using static System.Net.Mime.MediaTypeNames;

namespace StudyApp.API.Repositories
{
    public class TestResultRepository : BaseRepository<TestResult>, ITestResultRepository
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
            var result = await _context.TestResults
                         .Include(r => r.TestResultAnswers)
                          .ThenInclude(a => a.Question)
                          .ThenInclude(q => q.MockOptions)
                         .FirstOrDefaultAsync(r => r.Id == mockTestresultId);

            if (result == null)
                throw new KeyNotFoundException($"result {mockTestresultId} not found.");

            return result;
        }

        public async Task DeleteTestResultsAsync(int resultId)
        {
            var testResult = await _context.TestResults
                       .Include(tr => tr.TestResultAnswers)
                       .FirstOrDefaultAsync(tr => tr.Id == resultId);

            if (testResult == null)

                throw new KeyNotFoundException($"TestResult with id {resultId} not found.");

            // Delete all child answers first
            if (testResult.TestResultAnswers != null && testResult.TestResultAnswers.Any())
            {
                _context.TestResultAnswers.RemoveRange(testResult.TestResultAnswers);
            }

            // Delete main TestResult
            _context.TestResults.Remove(testResult);

            await _context.SaveChangesAsync();
        }
    }
}
