using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class OptionServices : IOptionServices
    {
        private readonly IOptionRepository _optionRepository;

        public OptionServices(IOptionRepository optionRepository)
        {
            _optionRepository = optionRepository;
        }

        public async Task AddOption(CreateOptionModel request)
        {
            Option option = new Option()
            {
                OptionText = request.OptionText,
                IsCorrect = request.IsCorrect,
                QuestionId = request.QuestionId,
            };

            await _optionRepository.AddAsync(option);
        }
    }
}
