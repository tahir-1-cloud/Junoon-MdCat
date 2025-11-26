using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IAuthenticationServices
    {
        public Task<CreateApplicationUserModel> AddNewStudent(CreateApplicationUserModel student);
        public Task<LoginResponse> LoginStudent(LoginModel student);

        public Task<IEnumerable<ApplicationUserModel>> GetAllStudent();
    }
}
