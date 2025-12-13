using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;
using StudyApp.API.Services.Implementations;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PaperController : ControllerBase
    {
        private readonly IPaperServices _paperServices;
        private readonly IAttemptService _service;

        public PaperController(IPaperServices paperServices, IAttemptService service)
        {
            _paperServices = paperServices;
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> AddPaper([FromBody] CreatePaperModel model)
        {
            try
            {
                await _paperServices.AddPaper(model);
                return Created();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPaperWithQuestion(int paperId)
        {
            try
            {
                PaperModel data=await _paperServices.GetPaperWithQuestions(paperId);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetPaperWithQuestionDto(int paperId)
        {
            try
            {
                StudentPaperDto? dto = await _paperServices.GetStudentPaperAsync(paperId);
                if (dto == null) return NotFound($"Paper with id {paperId} not found.");
                return Ok(dto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPapers()
        {
            try
            {
                IEnumerable<PaperModel> papers = await _paperServices.GetPapers();
                return Ok(papers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete("{paperId}")]
        public async Task<IActionResult> DeletePaper(int paperId)
        {
            try
            {
                await _paperServices.DeletePaper(paperId);
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
        [HttpPost]
        public async Task<IActionResult> AssignToSession([FromBody] AssignDto dto)
        {
            try
            {
                await _paperServices.AssignPaperToSession(dto.PaperId, dto.SessionId);
                return Ok();
            }
            catch (KeyNotFoundException knf)
            {
                return NotFound(knf.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> UnassignFromSession([FromBody] AssignDto model)
        {
            try
            {
                await _paperServices.UnassignPaperFromSession(model.PaperId, model.SessionId);
                return Ok("Paper unassigned successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAttemptsAdmin()
        {
            var data = await _paperServices.GetAllAttemptsForAdminAsync();
            return Ok(data);
        }

        [HttpGet("{attemptId:int}/result")]
        public async Task<IActionResult> GetAttemptResultAdmin(int attemptId)
        {
            var result = await _paperServices.GetAttemptResultAsync(attemptId, 0);
            if (result == null) return NotFound();
            return Ok(result);
        }


        #region Student Paper Actions

        [HttpGet("{studentId}")]
        public async Task<IActionResult> GetAssignedPapers(int studentId)
        {
            try
            {
                //studentId = 3; //temp hardcode for testing
                var data = await _paperServices.GetAssignedPapersForStudent(studentId);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{studentId}")]
        public async Task<IActionResult> GetAttempts(int studentId)
        {
            try
            {
                //studentId = 3;
                var attempts = await _paperServices.GetAttemptsForStudent(studentId);
                return Ok(attempts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> StartAttempt([FromBody] StartAttemptModel model)
        {
            try
            {
                //model.StudentId = 3;
                var resp = await _paperServices.StartAttempt(model);
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //[HttpGet("{attemptId}")]
        //public async Task<IActionResult> GetAttempt(int attemptId)
        //{
        //    try
        //    {
        //        var a = await _paperServices.GetAttemptById(attemptId);
        //        if (a == null) return NotFound();
        //        return Ok(a);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}


        [HttpGet("{attemptId}")]
        public async Task<IActionResult> GetAttempt(int attemptId)
        {
            long studentId = long.Parse(User.FindFirst("id")?.Value ?? "0");
            var attempt = await _service.GetAttemptAsync(attemptId);
            //var attempt = await _service.GetAttemptAsync(attemptId, studentId);
            if (attempt == null) return NotFound();
            return Ok(attempt);
        }

        [HttpPost]
        public async Task<IActionResult> SaveAnswer([FromBody] SaveAnswerDto model)
        {
            long studentId = long.Parse(User.FindFirst("id")?.Value ?? "0");
            try
            {
                //studentId = 3; //temp hardcode for testing
                await _service.SaveAnswerAsync(model, studentId);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CompleteAttempt([FromBody] CompleteAttemptDto model)
        {
            long studentId = long.Parse(User.FindFirst("id")?.Value ?? "0");
            try
            {
                //studentId = 3; //temp hardcode for testing
                await _service.CompleteAttemptAsync(model, studentId);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{attemptId:int}/result")]
        public async Task<IActionResult> GetAttemptResult(int attemptId)
        {
            long studentId = long.Parse(User.FindFirst("id")?.Value ?? "0");

            try
            {
                //studentId = 3; //temp hardcode for testing
                var result = await _service.GetAttemptResultAsync(attemptId, studentId);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("student")]
        public async Task<IActionResult> GetMyAttempts()
        {
            long studentId = long.Parse(User.FindFirst("id")?.Value ?? "0");
            //studentId = 3;
            var attempts = await _service.GetAttemptsForStudentAsync(studentId);
            return Ok(attempts);
        }


        #endregion

    }
}
