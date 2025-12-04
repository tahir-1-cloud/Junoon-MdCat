using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class UserLoginRepository : BaseRepository<UserLogin>, IUserLoginRepository
    {
        public UserLoginRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<UserLogin>> GetCurrentActiveSessionAsync(long userId)
        {
            // Check how many sessions the user currently has
            return await _context.UserLogins
                .Where(s => s.UserId == userId && s.ExpiresAt > DateTime.UtcNow)
                .OrderBy(s => s.CreatedAt)
                .ToListAsync();
        }
    }
}
