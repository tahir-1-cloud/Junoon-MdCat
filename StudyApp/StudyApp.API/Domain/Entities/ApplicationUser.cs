namespace StudyApp.API.Domain.Entities
{
    public class ApplicationUser : AuditEntity
    {
        public string FullName { get; set; }
        public string CNIC { get; set; }
        public string PhoneNumber { get; set; }
        public string EmailAddress { get; set; }
        public string Address { get; set; }
        public DateTime DOB { get; set; }
        public string FatherName { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
        public bool IsBlocked { get; set; }


        public int SessionId { get; set; }
        public Session Session { get; set; }
    }
}
