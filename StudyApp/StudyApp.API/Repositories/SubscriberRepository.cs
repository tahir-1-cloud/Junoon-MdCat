using Microsoft.EntityFrameworkCore;
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

        public async Task DeleteSubscriberAsync(int subId)
        {
            var subscriber = await _context.Subscribers.FirstOrDefaultAsync(p => p.Id == subId);

            if (subscriber == null)
            {
                throw new KeyNotFoundException($"Paper with id {subId} not found.");
            }

            _context.Subscribers.Remove(subscriber);
            await _context.SaveChangesAsync();
        }
    }
}
