using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IQuestionRepository : IBaseRepository<Question>
    {
        Task<Question> AddQuestionWithOptionsAsync(Question question);
        Task<List<Question>> GetQuestionsByPaperIdAsync(int paperId);
        Task DeleteQuestionAsync(int questionId);
    }
}
