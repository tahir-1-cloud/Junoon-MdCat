using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IAttemptRepository
    {
        Task<StudentAttempt?> GetByIdAsync(int attemptId);
        //Task<AttemptDto?> GetAttemptDtoForStudentAsync(int attemptId, long studentId);
        Task<AttemptDto?> GetAttemptDtoForStudentAsync(int attemptId);
        Task<List<QuestionForAttemptDto>> GetQuestionsForAttemptAsync(int attemptId);
        Task SaveAnswerAsync(StudentAnswer answer);
        Task<List<StudentAnswer>> GetAnswersForAttemptAsync(int attemptId);
        Task UpdateAttemptAsync(StudentAttempt attempt);
    }
}
