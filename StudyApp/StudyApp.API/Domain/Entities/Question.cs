namespace StudyApp.API.Domain.Entities
{
    public class Question : AuditEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public int PaperId { get; set; }
        
        // Enable lazy loading of the Paper reference
        public virtual Paper Paper { get; set; }

        public virtual ICollection<Option> Options { get; set; } = new List<Option>();
    }
}
