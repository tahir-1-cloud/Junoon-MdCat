namespace StudyApp.API.Models
{

    public class CreateQuestionModel
    {
        public int PaperId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public List<OptionDto> Options { get; set; }
    }
}
