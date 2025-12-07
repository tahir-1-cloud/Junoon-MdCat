using System.ComponentModel.DataAnnotations;

namespace StudyApp.API.Dto
{
    public class LectureDto
    {
        public int Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public string YoutubeUrl { get; set; }
        public string ImageUrl { get; set; }
    }
    
}
