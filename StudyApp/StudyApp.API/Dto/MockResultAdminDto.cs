namespace StudyApp.API.Dto
{
    public class MockResultAdminDto
    {
        public int TestResultId { get; set; }
        public int MockTestId { get; set; }
        public int Correct { get; set; }
        public int Incorrect { get; set; }
        public int Total { get; set; }
        public int Percentage { get; set; }
        public DateTime AttemptDate { get; set; }

        public List<MockTestResultDto> Details { get; set; }
    }
}
