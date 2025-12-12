using StudyApp.API.Dto;
using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IAttemptService
    {
        //Task<AttemptDto?> GetAttemptAsync(int attemptId, long studentId);
        Task<AttemptDto?> GetAttemptAsync(int attemptId);
        Task SaveAnswerAsync(SaveAnswerDto model, long studentId);
        Task CompleteAttemptAsync(CompleteAttemptDto model, long studentId);
        Task<bool> TryJoinAttemptAsync(int attemptId, long studentId, string connectionId);
        Task LeaveAttemptAsync(int attemptId, string connectionId);
        Task RegisterHeartbeatAsync(int attemptId, string connectionId);

        Task NotifyForceJoinAsync(int attemptId, long studentId, string connectionId);

        Task<AttemptResultDto?> GetAttemptResultAsync(int attemptId, long requestingStudentId);

    }
}
