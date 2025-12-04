namespace StudyApp.API.Domain.Entities
{
    public class MockQuestion:AuditEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public int MockTestId { get; set; }

        // Enable lazy loading of the Paper reference
        public virtual MockTest MockTest { get; set; }

        public virtual ICollection<MockOption> MockOptions { get; set; } = new List<MockOption>();
    }
}
