using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StudentLecturesController : ControllerBase
    {
        private readonly IStudentLectureService _studentLectureService;

        public StudentLecturesController(IStudentLectureService studentLectureService)
        {
            _studentLectureService = studentLectureService;
        }

        [HttpPost]
        [RequestSizeLimit(524_288_000)]
        public async Task<IActionResult> UploadLectures([FromForm] LectureDetailsModel model)
        {         
            try
            {
                if (model == null) return BadRequest("Model is required.");
                if (model.Thumbnail == null || model.Video == null) return BadRequest("Thumbnail and Video are required.");

                await _studentLectureService.CreateLectureAsync(model);
                return Created();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
