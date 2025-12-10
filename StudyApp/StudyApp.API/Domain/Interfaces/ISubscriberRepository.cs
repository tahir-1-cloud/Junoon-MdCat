using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Domain.Interfaces
{
    public interface ISubscriberRepository:IBaseRepository<Subscriber>
    {
        Task DeleteSubscriberAsync(int subId);
    }
}
