using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface ISubscriberServices
    {
        Task AddSubscriber(SubscriberModel request);

        Task<IEnumerable<SubscriberModel>> GetSubscriberInfo();
    }
}
