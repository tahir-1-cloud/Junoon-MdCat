using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IQuestionServices
    {
        Task AddQuestion(CreateQuestionModel question);

        Task<List<QuestionModel>> GetQuestionsForPaperAsync(int paperId);
        Task DeleteQuestionAsync(int questionId);
    }
}
