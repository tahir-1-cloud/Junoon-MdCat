using StudyApp.API.Models;

namespace StudyApp.API.Domain.Entities
{
    public class Paper : AuditEntity
    {
        public string Title { get; set; } = string.Empty;
        public DateTime TestConductedOn { get; set; }
        public int DurationMinutes { get; set; } = 60;
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
        public ICollection<PaperSession> PaperSessions { get; set; } = new List<PaperSession>();
        public ICollection<StudentAttempt> Attempts { get; set; } = new List<StudentAttempt>();
    }
}
