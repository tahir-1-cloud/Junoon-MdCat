using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IContactServices
    {
        Task SendContactInfo(ContactMessageModel request);

        Task<IEnumerable<ContactMessageModel>> GetContactInfo();
    }
}
