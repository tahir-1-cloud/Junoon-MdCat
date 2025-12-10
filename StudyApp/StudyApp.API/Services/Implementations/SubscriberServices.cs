using Azure.Core;
using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class SubscriberServices:ISubscriberServices
    {
        private readonly ISubscriberRepository _subscriberRepository;

        public SubscriberServices(ISubscriberRepository subscriberRepository)
        {
            _subscriberRepository = subscriberRepository;
        }

        public async Task AddSubscriber(SubscriberModel model)
        {
            var  subscriber = new Subscriber
            {
                Email = model.Email,
                CreatedAt = DateTime.UtcNow

            };

            await _subscriberRepository.AddAsync(subscriber);
        }

        public async Task<IEnumerable<SubscriberModel>> GetSubscriberInfo()
        {
            IEnumerable<Subscriber> enumerable = await _subscriberRepository.GetAsync();
            return enumerable.Adapt<IEnumerable<SubscriberModel>>();
        }

        public async Task DeleteSubscriber(int subscriberId)
        {
            await _subscriberRepository.DeleteSubscriberAsync(subscriberId);
        }
    }
}
