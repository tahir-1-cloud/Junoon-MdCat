namespace StudyApp.API.Models
{
    public class CreatePaperModel
    {
        public string Title { get; set; } = string.Empty;
        public DateTime TestConductionDate { get; set; }
    }

    public class AdminAttemptListDto
    {
        public int AttemptId { get; set; }

        public int PaperId { get; set; }
        public string PaperTitle { get; set; } = "";

        public int? SessionId { get; set; }
        public string? SessionTitle { get; set; }

        public int StudentId { get; set; }
        public string StudentName { get; set; } = "";

        public string Status { get; set; } = "";
        public decimal Score { get; set; }
        public int Percentage { get; set; }

        public DateTime AttemptedOn { get; set; }
    }

}
