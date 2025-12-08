namespace StudyApp.API.Dto
{
    public class TestResultDto
    {
        public int MockTestId { get; set; }

        public int Correct { get; set; }
        public int Incorrect { get; set; }
        public int Total { get; set; }
        public int Percentage { get; set; }

        public DateTime CreatedAt { get; set; }

    }
}
