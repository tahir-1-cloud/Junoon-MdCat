using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IPapersRepository : IBaseRepository<Paper>
    {
        Task<Paper?> GetPaperWithQuestions(int paperId);
        Task DeletePaperAsync(int paperId);
        Task AssignPaperToSessionAsync(int paperId, int sessionId);
        Task<PaperSession?> GetPaperSession(int paperId, int sessionId);
        Task RemovePaperSession(PaperSession entry);




        Task<List<AssignedPaperDto>> GetAssignedPapersForStudent(int studentId);
        Task<List<StudentAttemptDto>> GetAttemptsForStudent(int studentId);
        Task<bool> IsPaperAssignedToAnySession(int paperId);
        Task<StudentAttempt?> GetInProgressAttempt(int paperId, int studentId);
        Task<StudentAttempt?> GetCompletedAttempt(int paperId, int studentId);
        Task AddAttempt(StudentAttempt attempt);
        Task<StudentAttemptDto?> GetAttemptById(int attemptId);

        Task<StudentPaperDto?> GetStudentPaperAsync(int paperId);

    }
}
