using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IPapersRepository : IBaseRepository<Paper>
    {
        Task<Paper?> GetPaperWithQuestions(int paperId);

        Task DeletePaperAsync(int paperId);
        Task AssignPaperToSessionAsync(int paperId, int sessionId);
    }
}
