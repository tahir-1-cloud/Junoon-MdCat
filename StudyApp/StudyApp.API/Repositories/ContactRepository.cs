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
    }
}
