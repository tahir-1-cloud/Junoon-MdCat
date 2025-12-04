using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IMockQuestionRepository: IBaseRepository<MockQuestion>
    {
        Task<MockQuestion> AddMockQuestionWithOptionsAsync(MockQuestion question);

        Task<List<MockQuestion>> GetMockQuestionsByPaperIdAsync(int MockpaperId);

    }
}
