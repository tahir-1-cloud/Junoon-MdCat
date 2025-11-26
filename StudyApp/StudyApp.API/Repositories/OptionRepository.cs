using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class OptionRepository : BaseRepository<Option>, IOptionRepository
    {
        public OptionRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
