using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Models;
using StudyApp.API.Services.Implementations;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StudentEnrollmentController : ControllerBase
    {
        private readonly IStudentEnrollServices _studentEnrollServices;
        public StudentEnrollmentController(IStudentEnrollServices studentEnrollServices)
        {
            _studentEnrollServices = studentEnrollServices;
        }

        [HttpPost]
        public async Task<IActionResult> StudentEnroll([FromBody] StudentEnrollModel model)
        {
            try
            {
                await _studentEnrollServices.AddEnrollmentAsync(model);
                return Created();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEnrollStudent()
        {
            try
            {
                IEnumerable<StudentEnrollModel> enroll = await _studentEnrollServices.GetEnrollStudents();
                return Ok(enroll);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
