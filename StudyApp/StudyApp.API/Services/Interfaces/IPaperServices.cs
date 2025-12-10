using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IPaperServices
    {
        Task AddPaper(CreatePaperModel request);
        Task<PaperModel> GetPaperWithQuestions(int paperId);
        Task<IEnumerable<PaperModel>> GetPapers();

        Task DeletePaper(int paperId);
        Task AssignPaperToSession(int paperId, int sessionId);
        Task UnassignPaperFromSession(int paperId, int sessionId);

        Task<IEnumerable<AssignedPaperDto>> GetAssignedPapersForStudent(int studentId);
        Task<IEnumerable<StudentAttemptDto>> GetAttemptsForStudent(int studentId);
        Task<StartAttemptResponse> StartAttempt(StartAttemptModel model);
        Task<StudentAttemptDto?> GetAttemptById(int attemptId);

        Task<StudentPaperDto> GetStudentPaperAsync(int paperId);

    }
}
