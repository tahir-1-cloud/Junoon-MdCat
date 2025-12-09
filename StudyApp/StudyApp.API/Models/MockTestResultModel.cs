namespace StudyApp.API.Models
{
    public class MockTestResultModel
    {
        public int Id { get; set; }

        public int Correct { get; set; }
        public int Incorrect { get; set; }
        public int Total { get; set; }
        public int Percentage { get; set; }
    }
}
