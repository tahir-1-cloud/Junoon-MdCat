namespace StudyApp.API.Domain.Entities
{
    public class Lecturedetails: AuditEntity
    {
        public string Title { get; set; }
        public string VideoUrl { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Description { get; set; }

        public ICollection<StudentLecture> StudentLectures { get; set; } = new List<StudentLecture>();
    }
}
