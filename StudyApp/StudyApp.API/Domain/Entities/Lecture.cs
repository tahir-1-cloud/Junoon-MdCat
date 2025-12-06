using System.ComponentModel.DataAnnotations;

namespace StudyApp.API.Domain.Entities
{
    public class Lecture:AuditEntity
    {
        public string Title { get; set; }

        [MaxLength(2000)]
        public string Description { get; set; }

        public string YoutubeUrl { get; set; }

        public string? ImageUrl { get; set; }
    }
}
