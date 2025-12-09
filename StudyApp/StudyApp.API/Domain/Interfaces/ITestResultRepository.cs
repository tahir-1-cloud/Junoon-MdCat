using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Domain.Interfaces
{
    public interface ITestResultRepository:IBaseRepository<TestResult>
    {
        Task<List<TestResult>> GetResultsByTestIdAsync(int mockTestId);

        Task<TestResult> GetMockResultWithDetailsAsync(int mockTestresultId);
    }
}
