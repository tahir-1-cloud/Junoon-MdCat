using StudyApp.API.Domain.Entities;
using StudyApp.API.Dto;
using StudyApp.API.Models;

namespace StudyApp.API.Mappings
{
    public static class AttemptResultMapper
    {
        public static AttemptResultDtoAdmin MapToDto(StudentAttempt attempt)
        {
            if (attempt == null)
                throw new ArgumentNullException(nameof(attempt));

            if (attempt.Paper == null)
                throw new InvalidOperationException("Paper must be included when mapping AttemptResult.");

            var questions = attempt.Paper.Questions ?? new List<Question>();
            var studentAnswers = attempt.StudentAnswers ?? new List<StudentAnswer>();

            int total = questions.Count;
            int correctCount = 0;

            var questionResults = new List<AttemptQuestionResultDto>();

            foreach (var q in questions)
            {
                var studentAnswer = studentAnswers
                    .FirstOrDefault(a => a.QuestionId == q.Id);

                var correctOption = q.Options.FirstOrDefault(o => o.IsCorrect);

                bool isCorrect =
                    studentAnswer != null &&
                    correctOption != null &&
                    studentAnswer.SelectedOptionId == correctOption.Id;

                if (isCorrect)
                    correctCount++;

                questionResults.Add(new AttemptQuestionResultDto
                {
                    QuestionId = q.Id,
                    QuestionText = q.Title,

                    UserSelectedOptionId = studentAnswer?.SelectedOptionId,
                    UserSelectedOptionText = studentAnswer == null
                        ? null
                        : q.Options.FirstOrDefault(o => o.Id == studentAnswer.SelectedOptionId)?.OptionText,

                    CorrectOptionId = correctOption?.Id ?? 0,
                    CorrectOptionText = correctOption?.OptionText ?? string.Empty,

                    IsCorrect = isCorrect
                });
            }

            int percentage = total > 0
                ? (int)Math.Round((correctCount * 100.0) / total)
                : 0;

            return new AttemptResultDtoAdmin
            {
                AttemptId = attempt.Id,
                StudentId = attempt.StudentId,
                Status = attempt.Status,

                Total = total,
                Correct = correctCount,
                Percentage = percentage,

                DurationMinutes = attempt.Paper.DurationMinutes,
                AttemptedOn = attempt.AttemptedOn,

                Questions = questionResults
            };
        }
    }

}
