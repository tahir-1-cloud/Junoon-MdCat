using System.ComponentModel.DataAnnotations;

namespace StudyApp.API.Models
{
    public class LectureModel
    {
        public string Title { get; set; }

        [MaxLength(2000)]
        public string Description { get; set; }
        public string YoutubeUrl { get; set; }
        public IFormFile Image { get; set; } 
    }
}
