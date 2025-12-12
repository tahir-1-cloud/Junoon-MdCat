namespace StudyApp.API.Domain.Entities
{
    public class StudentLecture:AuditEntity
    {
        public int StudentId { get; set; }
        public ApplicationUser Students { get; set; }

        public int LecturedetailId { get; set; }
        public Lecturedetails Lecturedetails { get; set; }

        public DateTime AssignedAt { get; set; }
        public bool IsWatched { get; set; }
        public DateTime? WatchedAt { get; set; }
    }
}
