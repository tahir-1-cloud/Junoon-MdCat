using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Dto;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class TestResultServices: ITestResultServices
    {
        private readonly ITestResultRepository _testResultRepository;
        private readonly IMockRepository _mockRepository;
        public TestResultServices(ITestResultRepository testResultRepository, IMockRepository mockRepository)
        {
            _testResultRepository = testResultRepository;
            _mockRepository = mockRepository;
        }


        public async Task<TestResultDto> SubmitTestAsync(SubmitTestDto dto)
        {
            // 1️⃣ Get the test with questions and options
            var test = await _mockRepository.GetMockTestWithQuestionsAsync(dto.MockTestId);
            if (test == null) throw new Exception("Test not found");

            // 2️⃣ Calculate correct answers
            int correct = 0;
            foreach (var answer in dto.Answers)
            {
                var question = test.MockQuestions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question == null) continue;

                var option = question.MockOptions.FirstOrDefault(o => o.Id == answer.OptionId);
                if (option != null && option.IsCorrect)
                    correct++;
            }

            int total = test.MockQuestions.Count;
            int incorrect = total - correct;
            int percentage = (int)((correct / (double)total) * 100);

            // 3️⃣ Create TestResult
            var result = new TestResult
            {
                MockTestId = dto.MockTestId,
                Correct = correct,
                Incorrect = incorrect,
                Total = total,
                Percentage = percentage,
                CreatedAt = DateTime.Now
            };

            // 4️⃣ Save result
            await _testResultRepository.AddAsync(result);

            return new TestResultDto
            {
                MockTestId = result.MockTestId,
                Correct = result.Correct,
                Incorrect = result.Incorrect,
                Total = result.Total,
                Percentage = result.Percentage,
                CreatedAt = result.CreatedAt
            };
        }
    }
}
