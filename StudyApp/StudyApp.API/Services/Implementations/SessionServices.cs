using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class SessionServices : ISessionServices
    {
        private readonly ISessionRepository _sessionRepository;

        public SessionServices(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        public async Task<SessionModel> AddSession(CreateSessionModel request)
        {
            try
            {
                Session session = new Session()
                {
                    Title = request.Title,
                    Description = request.Description,
                    SessionYear = request.SessionYear
                };

                await _sessionRepository.AddAsync(session);

                return session.Adapt<SessionModel>();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SessionModel>> GetActiveSessions()
        {
            try
            {
                IEnumerable<Session> enumerable = await _sessionRepository.GetAllActiveAsync();
                return enumerable.Adapt<IEnumerable<SessionModel>>();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SessionModel>> GetSessions()
        {
            try
            {
                IEnumerable<Session> enumerable = await _sessionRepository.GetAsync();
                return enumerable.Adapt<IEnumerable<SessionModel>>();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
