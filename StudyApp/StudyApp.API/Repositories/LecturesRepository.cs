using Microsoft.EntityFrameworkCore;
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


        public async Task DeleteLecturesAsync(int lecturesId)
        {
            var lecture = await _context.Lectures.FirstOrDefaultAsync(p => p.Id == lecturesId);

            if (lecture == null)
            {
                throw new KeyNotFoundException($"Paper with id {lecturesId} not found.");
            }

            _context.Lectures.Remove(lecture);
            await _context.SaveChangesAsync();
        }
    }
}
