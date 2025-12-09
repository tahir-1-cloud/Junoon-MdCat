using StudyApp.API.Domain.Entities;
using StudyApp.API.Dto;
using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface ITestResultServices
    {
        Task<TestResultDto> SubmitTestAsync(SubmitTestDto dto);

        Task<MockResultAdminDto> GetTestResultForAdminAsync(int testResultId);

        Task<IEnumerable<MockTestResultModel>> GetAllMockTestResults();

    }
}
