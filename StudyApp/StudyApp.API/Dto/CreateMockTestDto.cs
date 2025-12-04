namespace StudyApp.API.Dto
{
    public class CreateMockTestDto
    {

        public int Id { get; set; }
        public string Title { get; set; }

        public DateTime TestConductedOn { get; set; }

        //public int DurationInMinutes { get; set; }
        //public bool IsActive { get; set; } = true;

    }
}
