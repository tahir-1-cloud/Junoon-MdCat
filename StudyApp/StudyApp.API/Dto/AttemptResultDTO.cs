namespace StudyApp.API.Dto
{
    public class AttemptResultDto
    {
        public int AttemptId { get; set; }
        public long StudentId { get; set; }
        public string Status { get; set; } = "";
        public int Total { get; set; }
        public int Correct { get; set; }
        public int Percentage { get; set; }
        public int? DurationMinutes { get; set; }
        public DateTime? AttemptedOn { get; set; }
        public List<QuestionResultDto> Questions { get; set; } = new();
    }

    public class QuestionResultDto
    {
        public int QuestionId { get; set; }
        public string Title { get; set; } = "";
        public List<OptionResultDto> Options { get; set; } = new();
        public int? UserOptionId { get; set; }
        public string? Explanation { get; set; }
    }

    public class OptionResultDto
    {
        public int Id { get; set; }
        public string OptionText { get; set; } = "";
        public bool IsCorrect { get; set; }
    }

    public class AttemptEntity
    {
        public int AttemptId { get; set; }
        public long StudentId { get; set; }
        public string Status { get; set; } = "";
        public int? DurationMinutes { get; set; }
        public DateTime? AttemptedOn { get; set; }
        public List<QuestionEntity> Questions { get; set; } = new();
        public List<SavedAnswerEntity> SavedAnswers { get; set; } = new();
    }

    public class QuestionEntity
    {
        public int QuestionId { get; set; }
        public string Title { get; set; } = "";
        public string? Explanation { get; set; }
        public int? Order { get; set; }
        public List<OptionEntity> Options { get; set; } = new();
    }

    public class OptionEntity
    {
        public int OptionId { get; set; }
        public string OptionText { get; set; } = "";
        public bool IsCorrect { get; set; }
        public int? Order { get; set; }
    }

    public class SavedAnswerEntity
    {
        public int QuestionId { get; set; }
        public int? SelectedOptionId { get; set; }
    }
}
