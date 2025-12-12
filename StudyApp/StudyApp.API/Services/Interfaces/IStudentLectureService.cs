using StudyApp.API.Domain.Entities;
using StudyApp.API.Dto;
using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IStudentLectureService
    {
        Task CreateLectureAsync(LectureDetailsModel model);
    }
}
