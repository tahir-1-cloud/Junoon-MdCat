using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Dto;
using StudyApp.API.Migrations;
using StudyApp.API.Models;
using StudyApp.API.Services.Implementations;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PublicLecturesController : ControllerBase
    {
        private readonly ILectureServices _lectureServices;
        private readonly IWebHostEnvironment _env;
        public PublicLecturesController(ILectureServices lectureServices, IWebHostEnvironment env)
        {
            _lectureServices = lectureServices;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> AddLecture([FromForm] LectureModel model)
        {
            try
            {
                if (model.Image == null)
                    return BadRequest("Image is missing!");

                string webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                string uploadFolder = Path.Combine(webRoot, "uploads");
                if (!Directory.Exists(uploadFolder))
                    Directory.CreateDirectory(uploadFolder);

                string fileName = Guid.NewGuid() + Path.GetExtension(model.Image.FileName);
                string fullPath = Path.Combine(uploadFolder, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }

                string imagePath = $"/uploads/{fileName}";

                var lectureDto = new LectureDto
                {
                    Title = model.Title,
                    Description = model.Description,
                    YoutubeUrl = model.YoutubeUrl,
                    ImageUrl = imagePath
                };

                await _lectureServices.AddLectureAsync(lectureDto);

                return Created("", lectureDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAlllectures()
        {
            try
            {
                IEnumerable<LectureDto> lectur = await _lectureServices.GetLectures();
                return Ok(lectur);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete("{lecturesId}")]
        public async Task<IActionResult> DeleteLecturesById(int lecturesId)
        {
            try
            {
                await _lectureServices.Deletelectures(lecturesId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                // log ex if you have logger
                return BadRequest(ex.Message);
            }
        }
    }
}
