using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface ISessionServices
    {
        Task<SessionModel> AddSession(CreateSessionModel request);

        Task<IEnumerable<SessionModel>> GetSessions();

        Task<IEnumerable<SessionModel>> GetActiveSessions();
    }
}
