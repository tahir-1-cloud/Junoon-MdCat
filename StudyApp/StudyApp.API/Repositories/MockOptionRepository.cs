using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class MockOptionRepository : BaseRepository<MockOption>, IMockOptionRepository
    {
        public MockOptionRepository(ApplicationDbContext context):base(context)
        {
            
        }
    }
}
