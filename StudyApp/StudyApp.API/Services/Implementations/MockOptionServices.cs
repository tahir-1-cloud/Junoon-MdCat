using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class MockOptionServices : IMockOptionServices
    {
        private readonly IMockOptionRepository _mockOptionRepository;
        public MockOptionServices(IMockOptionRepository mockOptionRepository)
        {
            _mockOptionRepository = mockOptionRepository;
        }
        public async Task AddMockOption(CreateMockOptionModel request)
        {
            MockOption option = new MockOption()
            {
                OptionText = request.OptionText,
                IsCorrect = request.IsCorrect,
                MockQuestionId = request.MockQuestionId,
            };

            await _mockOptionRepository.AddAsync(option);


        }
    }
}
