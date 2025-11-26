using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IOptionServices
    {
        Task AddOption(CreateOptionModel request);
    }
}
