using System.ComponentModel.DataAnnotations;

namespace StudyApp.API.Domain.Entities
{
    public class ContactMessage:AuditEntity
    {
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(200)]
        public string Email { get; set; }

        [MaxLength(1000)]
        public string Message { get; set; }
    }
}
