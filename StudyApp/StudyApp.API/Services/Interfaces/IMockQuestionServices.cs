using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IMockQuestionServices
    {
        Task AddMockQuestion(MockQuestionModel question);

        Task<List<MockQuestionModel>> GetMockQuestionsForPaperAsync(int MockpaperId);

    }
}
