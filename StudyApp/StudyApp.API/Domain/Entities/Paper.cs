namespace StudyApp.API.Domain.Entities
{
    public class Paper : AuditEntity
    {
        public string Title { get; set; } = string.Empty;
        public DateTime TestConductedOn { get; set; }

        // Enable lazy loading
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
    }
}
