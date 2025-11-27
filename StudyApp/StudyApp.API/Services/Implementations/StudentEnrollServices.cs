using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class StudentEnrollServices:IStudentEnrollServices
    {
        private readonly IStudentEnrollRepository _studentEnrollRepository;
        public StudentEnrollServices(IStudentEnrollRepository studentEnrollRepository)
        {
            _studentEnrollRepository = studentEnrollRepository;
        }
        public async Task AddEnrollmentAsync(StudentEnrollModel model)
        {
            StudentEnrollment enrollment = new StudentEnrollment()
            {
                FullName = model.FullName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                PreferredCourse = model.PreferredCourse,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            await _studentEnrollRepository.AddAsync(enrollment);
        }
    }
}
