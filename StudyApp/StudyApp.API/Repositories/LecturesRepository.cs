using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class LecturesRepository:BaseRepository<Lecture>,ILecturesRepository
    {
        public LecturesRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
