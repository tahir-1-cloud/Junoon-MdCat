using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class ApplicationUserRepository : BaseRepository<ApplicationUser>, IApplicationUserRepository
    {
        public ApplicationUserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<ApplicationUser?> GetUserByCNIC(string cnic)
        {
            return await _context.ApplicationUsers
                .AsNoTracking().FirstOrDefaultAsync(u => u.CNIC == cnic);
        }

        public async Task<ApplicationUser?> GetUserByCNICorEmail(string cnic, string email)
        {
            return await _context.ApplicationUsers
                .AsNoTracking().FirstOrDefaultAsync(u => u.CNIC == cnic || u.EmailAddress == email);
        }

        public async Task<ApplicationUser?> GetUserByEmail(string email)
        {
            return await _context.ApplicationUsers
                .AsNoTracking().FirstOrDefaultAsync(u => u.EmailAddress == email);
        }

        public async Task<ApplicationUser?> FindUserByUniqueFieldsAsync(string cnic, string email, string phone)
        {
            return await _context.ApplicationUsers
                .Include(u => u.Session)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.CNIC == cnic || u.EmailAddress == email || u.PhoneNumber == phone);
        }

        public async Task<ApplicationUser?> FindUserByUserNameAsync(string userName)
        {
            return await _context.ApplicationUsers
                .Include(u => u.Session)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.CNIC == userName || u.EmailAddress == userName || u.PhoneNumber == userName);
        }
    }
}
