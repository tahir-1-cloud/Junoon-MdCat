namespace StudyApp.API.Domain.Entities
{
    public class TestResultAnswer:AuditEntity
    {
        public int TestResultId { get; set; }
        public TestResult TestResult { get; set; }

        public int QuestionId { get; set; }
        public MockQuestion Question { get; set; }

        public int SelectedOptionId { get; set; }
        public MockOption SelectedOption { get; set; }
    }
}
