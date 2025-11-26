namespace StudyApp.API.Domain.Entities
{
    public class Session : AuditEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime SessionYear { get; set; }
    }
}
