using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IPaperServices
    {
        Task AddPaper(CreatePaperModel request);
        Task<PaperModel> GetPaperWithQuestions(int paperId);
        Task<IEnumerable<PaperModel>> GetPapers();
    }
}
