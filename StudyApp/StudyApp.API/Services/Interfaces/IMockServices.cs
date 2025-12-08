using StudyApp.API.Domain.Entities;
using StudyApp.API.Dto;
using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IMockServices
    {
        Task AddMockPaper(CreateMockTestDto request);

        Task<IEnumerable<CreateMockTestDto>> GetMockPapers();

        Task<List<MockTestSummaryDto>> GetAllMockTestsAsync();
        Task<MockTest> GetMockTestWithQuestionsAsync(int id);


    }
}
