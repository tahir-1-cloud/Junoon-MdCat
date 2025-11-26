namespace StudyApp.API.Models
{
    public class MockQuestionModel
    {
        public int MockTestId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        // Navigation
        public List<MockOptionModel> Options { get; set; } = new();

    }
}
