using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly ISessionServices _sessionServices;

        public SessionController(ISessionServices sessionServices)
        {
            _sessionServices = sessionServices;
        }

        [HttpPost]
        public async Task<IActionResult> AddSession([FromBody] CreateSessionModel request)
        {
            SessionModel sessionModel = await _sessionServices.AddSession(request);
            return Ok(sessionModel);
        }

        [HttpGet]
        public async Task<IActionResult> GetSession()
        {
            IEnumerable<SessionModel> enumerable = await _sessionServices.GetSessions();
            return Ok(enumerable);
        }

        [HttpGet]
        public async Task<IActionResult> GetActiveSession()
        {
            IEnumerable<SessionModel> enumerable = await _sessionServices.GetActiveSessions();
            return Ok(enumerable);
        }
    }

}
