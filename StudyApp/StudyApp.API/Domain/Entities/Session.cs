using StudyApp.API.Models;

namespace StudyApp.API.Domain.Entities
{
    public class Session : AuditEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime SessionYear { get; set; }

        public ICollection<PaperSession> PaperSessions { get; set; } = new List<PaperSession>();
    }
}
