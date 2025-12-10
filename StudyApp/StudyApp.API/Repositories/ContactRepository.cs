using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class ContactRepository: BaseRepository<ContactMessage>, IContactRepository
    {

        public ContactRepository(ApplicationDbContext context) : base(context)
        {

        }


        public async Task DeleteContactInfoAsync(int contactId)
        {
            var contact = await _context.ContactMessages.FirstOrDefaultAsync(p => p.Id == contactId);

            if (contact == null)
            {
                throw new KeyNotFoundException($"Paper with id {contactId} not found.");
            }

            _context.ContactMessages.Remove(contact);
            await _context.SaveChangesAsync();
        }
    }
}
