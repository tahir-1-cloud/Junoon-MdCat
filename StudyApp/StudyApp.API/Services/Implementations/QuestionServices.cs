using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class QuestionServices : IQuestionServices
    {
        private readonly IQuestionRepository _questionRepository;

        public QuestionServices(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }

        public async Task AddQuestion(CreateQuestionModel request)
        {
            if (request.Options.Count(o => o.IsCorrect) != 1)
                throw new InvalidOperationException("Exactly one option must be marked as correct.");

            Question question = new Question()
            {
                PaperId = request.PaperId,
                Title = request.Title,
                Description = request.Description,
                Options = request.Options.Select(o => new Option
                {
                    OptionText = o.OptionText,
                    IsCorrect = o.IsCorrect
                }).ToList()
            };

            await _questionRepository.AddQuestionWithOptionsAsync(question);
        }

        public async Task<List<QuestionModel>> GetQuestionsForPaperAsync(int paperId)
        {
            List<Question> questions = await _questionRepository.GetQuestionsByPaperIdAsync(paperId);
            List<QuestionModel> questionModels = questions.Adapt<List<QuestionModel>>();
            return questionModels;
        }
        public async Task DeleteQuestionAsync(int questionId)
        {
            // Let repository handle the retrieval and soft-delete
            await _questionRepository.DeleteQuestionAsync(questionId);
        }
    }
}
