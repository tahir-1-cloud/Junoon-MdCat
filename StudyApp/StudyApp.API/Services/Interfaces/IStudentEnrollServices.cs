using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IStudentEnrollServices
    {
        Task AddEnrollmentAsync(StudentEnrollModel model);
    }
}
