using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using StudyApp.API.Cloudinary;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Dto;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class StudentLectureService:IStudentLectureService
    {
        private readonly IStudentLectureRepository _StudentLectureRepository;
        private readonly CloudinaryDotNet.Cloudinary _cloudinary;

        public StudentLectureService(IStudentLectureRepository studentLectureRepository, CloudinaryDotNet.Cloudinary cloudinary)
        {
            _StudentLectureRepository = studentLectureRepository;
            _cloudinary = cloudinary;
        }


        public async Task CreateLectureAsync(LectureDetailsModel model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));
            if (model.Thumbnail == null) throw new ArgumentException("Thumbnail is required", nameof(model.Thumbnail));
            if (model.Video == null) throw new ArgumentException("Video is required", nameof(model.Video));

            // Upload thumbnail (image)
            var thumbnailUrl = await UploadImageAsync(model.Thumbnail, "lecture_thumbnails");

            // Upload video
            var videoUrl = await UploadVideoAsync(model.Video, "lecture_videos");

            var lecture = new Lecturedetails
            {
                Title = model.Title,
                Description = model.Description,
                ThumbnailUrl= thumbnailUrl,
                VideoUrl = videoUrl,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = 1,
                IsActive = true,
                IsDeleted = false
            };
            await _StudentLectureRepository.AddAsync(lecture);
        }

        private async Task<string> UploadImageAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                return null;

            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder,
                UseFilename = true,
                UniqueFilename = true
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return uploadResult.SecureUrl?.ToString();
        }


        private async Task<string> UploadVideoAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                return null;

            await using var stream = file.OpenReadStream();

            var uploadParams = new VideoUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder,
                UseFilename = true,
                UniqueFilename = true
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return uploadResult.SecureUrl?.ToString();
        }


    }
}
