namespace StudyApp.API.Dto
{
    public class SubmitTestDto
    {
        public int MockTestId { get; set; }
        public List<AnswerDto> Answers { get; set; }
    }
    public class AnswerDto
    {
        public int QuestionId { get; set; }
        public int OptionId { get; set; }
    }

    public class MockTestSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int TotalQuestions { get; set; }
    }
}
