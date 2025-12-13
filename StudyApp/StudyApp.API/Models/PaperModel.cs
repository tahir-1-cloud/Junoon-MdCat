using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Models
{
    public class PaperModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime TestConductedOn { get; set; }
        public int DurationMinutes { get; set; }
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

    public class StudentAttempt : AuditEntity
    {
        public int Id { get; set; }
        public int PaperId { get; set; }
        public Paper Paper { get; set; } = null!;
        public int StudentId { get; set; }
        public ApplicationUser Student { get; set; } = null!;
        public DateTime AttemptedOn { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public decimal Score { get; set; }
        public bool IsDeleted { get; set; }
        public string Status { get; set; } = "NotStarted";
        public int? UpdatedBy { get; set; }
        public int? CreatedBy { get; set; }
        public string? ActiveConnectionId { get; set; }
        public bool IsActiveSession { get; set; } = false;
        public List<StudentAnswer> StudentAnswers { get; set; } = new();

    }

    public class StudentAnswer : AuditEntity
    {
        public int Id { get; set; }
        public int StudentAttemptId { get; set; }
        public StudentAttempt StudentAttempt { get; set; } = null!;
        public int QuestionId { get; set; }
        public int? SelectedOptionId { get; set; }
        public bool IsMarkedForReview { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
    public class AssignDto
    {
        public int PaperId { get; set; }
        public int SessionId { get; set; }
    }



    public class AttemptDto
    {
        public int Id { get; set; }
        public int PaperId { get; set; }
        public long StudentId { get; set; }
        public DateTime AttemptedOn { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string Status { get; set; } = "NotStarted";
        public decimal Score { get; set; }
        public int DurationMinutes { get; set; }
        public List<QuestionForAttemptDto> Questions { get; set; } = new();
    }

    public class QuestionForAttemptDto
    {
        public int QuestionId { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<AttemptOptionDto> Options { get; set; } = new();
    }

    public class AttemptOptionDto
    {
        public int Id { get; set; }
        public string OptionText { get; set; } = string.Empty;
    }

    public class SaveAnswerDto
    {
        public int AttemptId { get; set; }
        public int QuestionId { get; set; }
        public int? SelectedOptionId { get; set; }
        public bool? MarkForReview { get; set; }
    }

    public class CompleteAttemptDto
    {
        public int AttemptId { get; set; }
    }

    public class AttemptListItemDto
    {
        public int AttemptId { get; set; }
        public int PaperId { get; set; }
        public string PaperTitle { get; set; } = string.Empty;
        public DateTime AttemptedOn { get; set; }
        public string Status { get; set; } = string.Empty;
        public int Correct { get; set; }
        public int Total { get; set; }
        public int Percentage { get; set; }
    }

    public class StudentAttemptSummaryEntity
    {
        public int AttemptId { get; set; }
        public int PaperId { get; set; }
        public string PaperTitle { get; set; } = string.Empty;
        public DateTime AttemptedOn { get; set; }
        public string Status { get; set; } = string.Empty;
        public int Correct { get; set; }
        public int Total { get; set; }
    }
}
