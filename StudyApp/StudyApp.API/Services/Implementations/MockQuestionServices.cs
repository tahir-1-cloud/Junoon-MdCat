using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class MockQuestionServices:IMockQuestionServices
    {
        private readonly IMockQuestionRepository _mockQuestionRepository;
        public MockQuestionServices(IMockQuestionRepository mockQuestionRepository)
        {
            _mockQuestionRepository = mockQuestionRepository;
        }
        //Mock Questions
        public async Task AddMockQuestion(MockQuestionModel request)
        {
            if (request.MockOptions.Count(o => o.IsCorrect) != 1)
                throw new InvalidOperationException("Exactly one option must be marked as correct.");

            MockQuestion question = new MockQuestion()
            {
                MockTestId = request.MockTestId,
                Title = request.Title,
                Description = request.Description,
                MockOptions = request.MockOptions.Select(o => new MockOption
                {
                    OptionText = o.OptionText,
                    IsCorrect = o.IsCorrect
                }).ToList()
            };

            await _mockQuestionRepository.AddMockQuestionWithOptionsAsync(question);
        }


        public async Task<List<MockQuestionModel>> GetMockQuestionsForPaperAsync(int MockpaperId)
        {
            List<MockQuestion> questions = await _mockQuestionRepository.GetMockQuestionsByPaperIdAsync(MockpaperId);
            List<MockQuestionModel> questionModels = questions.Adapt<List<MockQuestionModel>>();
            return questionModels;
        }
    }
}   
