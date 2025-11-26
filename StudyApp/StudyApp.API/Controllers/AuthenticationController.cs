using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationServices _authenticationServices;

        public AuthenticationController(IAuthenticationServices authenticationServices)
        {
            _authenticationServices = authenticationServices;
        }

        [HttpPost]
        public async Task<IActionResult> AddStudent([FromBody] CreateApplicationUserModel request)
        {
            try
            {
                CreateApplicationUserModel createApplicationUserModel = await _authenticationServices.AddNewStudent(request);
                return Ok(createApplicationUserModel);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> LoginStudent([FromBody] LoginModel request)
        {
            try
            {
                LoginResponse loginResponse = await _authenticationServices.LoginStudent(request);
                return Ok(loginResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStudents()
        {
            try
            {
                IEnumerable<ApplicationUserModel> enumerable = await _authenticationServices.GetAllStudent();
                return Ok(enumerable);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}
