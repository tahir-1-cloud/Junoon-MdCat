using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IStudentEnrollRepository: IBaseRepository<StudentEnrollment>
    {
        Task DeleteEnrolledStudentAsync(int studentId);
    }
}
