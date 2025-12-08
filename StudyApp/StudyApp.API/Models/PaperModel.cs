using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Models
{
    public class PaperModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime TestConductedOn { get; set; }
        public List<QuestionModel> Questions { get; set; } = new();
        public List<PaperSessionModel>? PaperSessions { get; set; }

    }
    public class PaperSessionModel
    {
        public int PaperId { get; set; }
        public int SessionId { get; set; }
    }
    public class PaperSession
    {
        public int PaperId { get; set; }
        public Paper Paper { get; set; } = null!;

        public int SessionId { get; set; }
        public Session Session { get; set; } = null!;

        public DateTime AssignedOn { get; set; }
        public string? AssignedBy { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class StudentAttempt
    {
        public int Id { get; set; }
        public int PaperId { get; set; }
        public Paper Paper { get; set; } = null!;
        public long StudentId { get; set; } // adjust type to your Users PK
        public DateTime AttemptedOn { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public decimal Score { get; set; }
        public bool IsDeleted { get; set; }
        public string Status { get; set; }
        // Add more fields as needed (answers JSON, duration, etc.)
    }
    public class AssignDto
    {
        public int PaperId { get; set; }
        public int SessionId { get; set; } // uses int to match Session.Id (adjust if Session.Id is long)
    }
}
