namespace StudyApp.API.Domain.Entities
{
    public class Option : AuditEntity
    {
        public string OptionText { get; set; }
        public bool IsCorrect { get; set; }

        public int QuestionId { get; set; }
        public virtual Question Question { get; set; }
    }
}
