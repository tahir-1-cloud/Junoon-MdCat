namespace StudyApp.API.Domain.Entities
{
    public class UserLogin : AuditEntity
    {
        public int UserId { get; set; }
        public ApplicationUser User { get; set; }

        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow;
    }
}
