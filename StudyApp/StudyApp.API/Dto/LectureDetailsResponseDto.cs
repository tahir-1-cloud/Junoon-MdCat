namespace StudyApp.API.Dto
{
    public class LectureDetailsResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string VideoUrl { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
