using StudyApp.API.Domain.Entities;
using StudyApp.API.Migrations;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IContactRepository:IBaseRepository<ContactMessage>
    {
        Task DeleteContactInfoAsync(int contactId);
    }
}
