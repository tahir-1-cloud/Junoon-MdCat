namespace StudyApp.API.Models
{
    public class OptionModel
    {
        public long Id { get; set; }
        public string OptionText { get; set; }
        public string? IsCorrect { get; set; }

    }

    public class CreateOptionModel
    {
        public string OptionText { get; set; }
        public bool IsCorrect { get; set; }

        public int QuestionId { get; set; }
    }
}
