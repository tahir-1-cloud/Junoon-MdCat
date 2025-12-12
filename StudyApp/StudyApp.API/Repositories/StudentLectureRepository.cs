using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class StudentLectureRepository: BaseRepository<Lecturedetails>, IStudentLectureRepository
    {
        public StudentLectureRepository(ApplicationDbContext context) : base(context)
        {

        }
    }
}
