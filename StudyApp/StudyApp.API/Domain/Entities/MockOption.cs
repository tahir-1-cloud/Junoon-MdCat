namespace StudyApp.API.Domain.Entities
{
    public class MockOption : AuditEntity
    {
        public string OptionText { get; set; }
        public bool IsCorrect { get; set; }

        public int MockQuestionId { get; set; }
        public virtual MockQuestion MockQuestion  { get; set; }
    }
}
