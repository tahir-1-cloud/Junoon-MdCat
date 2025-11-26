namespace StudyApp.API.Models
{
    public class QuestionModel
    {
        public string Title { get; set; }
        public string Description { get; set; }



        public List<OptionModel> Options { get; set; } = new();
    }
}
