using Microsoft.EntityFrameworkCore;
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

        public async Task DeleteEnrolledStudentAsync(int studentId)
        {
            var stdenroll = await _context.StudentEnrollments.FirstOrDefaultAsync(p => p.Id == studentId);

            if (stdenroll == null)
            {
                throw new KeyNotFoundException($"Paper with id {studentId} not found.");
            }

            _context.StudentEnrollments.Remove(stdenroll);
            await _context.SaveChangesAsync();
        }
    }
}
