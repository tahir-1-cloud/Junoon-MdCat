using StudyApp.API.Domain.Entities;
using StudyApp.API.Dto;
namespace StudyApp.API.Domain.Interfaces
{
    public interface IMockRepository:IBaseRepository<MockTest>
    {
        Task<List<MockTestSummaryDto>> GetAllMockTestsAsync();
        Task<MockTest> GetMockTestWithQuestionsAsync(int id);
    }
}
