using StudyApp.API.Domain.Entities;
using StudyApp.API.Dto;

namespace StudyApp.API.Services.Interfaces
{
    public interface ITestResultServices
    {
        Task<TestResultDto> SubmitTestAsync(SubmitTestDto dto);

        //Task<List<TestResult>> GetResultsByTestIdAsync(int mockTestId);
    }
}
