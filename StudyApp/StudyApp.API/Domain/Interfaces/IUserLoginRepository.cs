using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IUserLoginRepository : IBaseRepository<UserLogin>
    {
        Task<List<UserLogin>> GetCurrentActiveSessionAsync(long userId);
    }
}
