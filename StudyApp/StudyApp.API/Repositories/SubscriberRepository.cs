using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class SubscriberRepository: BaseRepository<Subscriber>, ISubscriberRepository
    {
        public SubscriberRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
