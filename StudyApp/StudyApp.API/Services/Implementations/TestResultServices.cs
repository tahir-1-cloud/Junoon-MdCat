using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Dto;
using StudyApp.API.Models;
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
            List<TestResultAnswer> answerEntities = new List<TestResultAnswer>();

            foreach (var answer in dto.Answers)
            {
                var question = test.MockQuestions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question == null) continue;

                var option = question.MockOptions.FirstOrDefault(o => o.Id == answer.OptionId);
                bool isCorrect = option != null && option.IsCorrect;

                if (isCorrect) correct++;

                answerEntities.Add(new TestResultAnswer
                {
                    QuestionId = question.Id,
                    SelectedOptionId = option?.Id ?? 0
                });
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
                TestResultAnswers = answerEntities,
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

        public async Task<MockResultAdminDto> GetTestResultForAdminAsync(int testResultId)
        {
            var result = await _testResultRepository.GetMockResultWithDetailsAsync(testResultId);
            if (result == null) return null;

            return new MockResultAdminDto
            {
                TestResultId = result.Id,
                MockTestId = result.MockTestId,
                Correct = result.Correct,
                Incorrect = result.Incorrect,
                Total = result.Total,
                Percentage = result.Percentage,
                AttemptDate = result.CreatedAt,
                Details = result.TestResultAnswers.Select(a => new MockTestResultDto
                {
                    QuestionText = a.Question.Title,
                    SelectedOption = a.SelectedOption.OptionText,
                    CorrectOption = a.Question.MockOptions.First(o => o.IsCorrect).OptionText,
                    IsCorrect = a.SelectedOption.IsCorrect
                }).ToList()
            };

        }


        public async Task<IEnumerable<MockTestResultModel>> GetAllMockTestResults()
        {
            IEnumerable<TestResult> enumerable = await _testResultRepository.GetAsync();
            return enumerable.Adapt<IEnumerable<MockTestResultModel>>();
        }

        public async Task DeleteTestResults(int resultId)
        {
            await _testResultRepository.DeleteTestResultsAsync(resultId);
        }
    }
}
