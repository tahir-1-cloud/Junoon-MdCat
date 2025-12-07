using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Dto;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class LectureServices:ILectureServices
    {
        private readonly ILecturesRepository _lecturesRepository;
        public LectureServices(ILecturesRepository lecturesRepository)
        {
            _lecturesRepository = lecturesRepository;
        }

        public async Task AddLectureAsync(LectureDto request)
        {
            var lecture = new Lecture
            {
                Title = request.Title,
                Description = request.Description,
                YoutubeUrl = request.YoutubeUrl,
                ImageUrl = request.ImageUrl
            };

            await _lecturesRepository.AddAsync(lecture);
        }

        public async Task<IEnumerable<LectureDto>> GetLectures()
        {
            IEnumerable<Lecture> enumerable = await _lecturesRepository.GetAsync();
            return enumerable.Adapt<IEnumerable<LectureDto>>();
        }
    }
}
