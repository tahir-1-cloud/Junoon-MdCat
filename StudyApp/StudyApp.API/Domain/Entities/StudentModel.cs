namespace StudyApp.API.Domain.Entities
{
    public class AssignedPaperDto
    {
        public int Id { get; set; }             
        public string Title { get; set; } = string.Empty;
        public DateTime? TestConductedOn { get; set; }
        public int? SessionId { get; set; }
        public string? SessionTitle { get; set; }
        public DateTime? AvailableFrom { get; set; }   
        public DateTime? AvailableTo { get; set; }
        public bool IsAttempted { get; set; }
    }

    public class StudentAttemptDto
    {
        public int Id { get; set; }
        public int PaperId { get; set; }
        public int StudentId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public decimal? Score { get; set; }
    }

    public class StartAttemptModel
    {
        public int PaperId { get; set; }
        public int StudentId { get; set; }
    }

    public class StartAttemptResponse
    {
        public int AttemptId { get; set; }
    }

    public class StudentOptionDto
    {
        public int Id { get; set; }
        public string OptionText { get; set; }
        public bool? IsCorrect { get; set; } = null;
    }

    public class StudentQuestionDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<StudentOptionDto> Options { get; set; } = new();
    }

    public class StudentPaperSessionDto
    {
        public int PaperId { get; set; }
        public int SessionId { get; set; }
        public string? SessionTitle { get; set; }
    }

    public class StudentPaperDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime? TestConductedOn { get; set; }
        public int? SessionId { get; set; }
        public string? SessionTitle { get; set; }
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
        public int? DurationMinutes { get; set; }
        public bool IsAttempted { get; set; }
        public List<StudentQuestionDto> Questions { get; set; } = new();
        public List<StudentPaperSessionDto>? PaperSessions { get; set; } = new();
    }
}
