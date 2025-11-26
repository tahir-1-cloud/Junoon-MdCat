namespace StudyApp.API.Models
{
    public class MockTestModel
    {
        public int Id { get; set; } // From AuditEntity
        public string Title { get; set; }

        public DateTime TestConductedOn { get; set; }


        public List<MockQuestionModel> MockQuestions { get; set; } = new();
    }
}
