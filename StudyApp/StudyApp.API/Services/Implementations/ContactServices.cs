using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class ContactServices:IContactServices
    {
        private readonly IContactRepository _contactRepository;

        public ContactServices(IContactRepository contactRepository)
        {
            _contactRepository = contactRepository;

        }

        public async Task SendContactInfo(ContactMessageModel request)
        {
            var  contactinfo = new ContactMessage
            {
                FullName = request.FullName,
                Email = request.Email,
                Message = request.Message,
                CreatedAt = DateTime.UtcNow

            };

            await _contactRepository.AddAsync(contactinfo);
        }

        public async Task<IEnumerable<ContactMessageModel>> GetContactInfo()
        {
            IEnumerable<ContactMessage> enumerable = await _contactRepository.GetAsync();
            return enumerable.Adapt<IEnumerable<ContactMessageModel>>();
        }
    }
}
