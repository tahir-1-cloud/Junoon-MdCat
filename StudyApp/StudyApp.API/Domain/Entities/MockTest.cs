namespace StudyApp.API.Domain.Entities
{
    public class MockTest:AuditEntity
    {
        public string Title { get; set; } = string.Empty;
        public DateTime TestConductedOn { get; set; }

        // Enable lazy loading
        public virtual ICollection<MockQuestion> MockQuestions { get; set; } = new List<MockQuestion>();

    }
}
