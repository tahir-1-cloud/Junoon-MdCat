namespace StudyApp.API.Domain.Entities
{
    public class TestResult:AuditEntity
    {
        public int MockTestId { get; set; }
        public MockTest MockTest { get; set; }

        public int Correct { get; set; }
        public int Incorrect { get; set; }
        public int Total { get; set; }
        public int Percentage { get; set; }
    }
}
