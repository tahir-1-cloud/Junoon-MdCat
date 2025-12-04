namespace StudyApp.API.Models
{
    public class PaperModel
    {
        public int Id { get; set; } // From AuditEntity
        public string Title { get; set; }
        public DateTime TestConductedOn { get; set; }
        public List<QuestionModel> Questions { get; set; } = new();
    }
}
