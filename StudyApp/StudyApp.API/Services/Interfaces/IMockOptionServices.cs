using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IMockOptionServices
    {
        Task AddMockOption(CreateMockOptionModel request);
    }
}
