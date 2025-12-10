namespace StudyApp.API.Models
{
    public class StudentEnrollModel
    {
        public int Id { get; set; }

        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string? City { get; set; }
        public string PreferredCourse { get; set; }

        public string Status { get; set; }
    }
}
