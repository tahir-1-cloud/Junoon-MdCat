using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IApplicationUserRepository : IBaseRepository<ApplicationUser>
    {
        Task<ApplicationUser?> GetUserByCNICorEmail(string cnic, string email);
        Task<ApplicationUser?> GetUserByCNIC(string cnic);
        Task<ApplicationUser?> GetUserByEmail(string email);
        Task<ApplicationUser?> FindUserByUniqueFieldsAsync(string cnic, string email, string phone);
        Task<ApplicationUser?> FindUserByUserNameAsync(string userName);
    }
}
