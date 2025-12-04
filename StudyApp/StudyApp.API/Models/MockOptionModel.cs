namespace StudyApp.API.Models
{
    public class MockOptionModel
    {
   
        public string OptionText { get; set; }
        public bool IsCorrect { get; set; }

    }
    public class CreateMockOptionModel
    {
        public string OptionText { get; set; }
        public bool IsCorrect { get; set; }
        public int MockQuestionId { get; set; }
    }
}
