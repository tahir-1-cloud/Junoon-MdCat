using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class StudentEnrollRepository:BaseRepository<StudentEnrollment>, IStudentEnrollRepository
    {
        public StudentEnrollRepository(ApplicationDbContext context):base(context)
        {
            
        }
    }
}
