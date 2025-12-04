using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class SessionRepository : BaseRepository<Session>, ISessionRepository
    {
        public SessionRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Session>> GetAllActiveAsync()
        {
            return await _context.Sessions.Where(x => x.IsActive).ToListAsync();
        }
    }
}
