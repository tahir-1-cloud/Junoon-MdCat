using System.ComponentModel.DataAnnotations;

namespace StudyApp.API.Domain.Entities
{
    public class Subscriber:AuditEntity
    {
        [EmailAddress]
        public string Email { get; set; }
    }
}
