using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class MockRepository:BaseRepository<MockTest>, IMockRepository
    {
        public MockRepository(ApplicationDbContext context) : base(context)
        {
        }

      
    }
}
