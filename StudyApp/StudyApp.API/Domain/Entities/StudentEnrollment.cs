namespace StudyApp.API.Domain.Entities
{
    public class StudentEnrollment:AuditEntity
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string PreferredCourse { get; set; }
        public string? City { get; set; }

        public string Status { get; set; } = "Pending"; // Default

    }
}
