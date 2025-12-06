using StudyApp.API.Dto;
using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface ILectureServices
    {
        Task AddLectureAsync(LectureDto request);
    }
}
