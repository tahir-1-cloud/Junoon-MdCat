namespace StudyApp.API.Models
{
    public class LectureDetailsModel
    {
        public string Title { get; set; }

        public string Description { get; set; }
        public IFormFile Thumbnail { get; set; }
        public IFormFile Video { get; set; }

    }
}
