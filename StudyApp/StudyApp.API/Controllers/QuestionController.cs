using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionServices _questionServices;

        public QuestionController(IQuestionServices questionServices)
        {
            _questionServices = questionServices;
        }

        [HttpPost]
        public async Task<IActionResult> AddQuestion([FromBody] CreateQuestionModel question)
        {
            try
            {
                await _questionServices.AddQuestion(question);
                return Created();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{paperId}")]
        public async Task<IActionResult> GetQuestionsForPaper(int paperId)
        {
            var questions = await _questionServices.GetQuestionsForPaperAsync(paperId);
            return Ok(questions);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            try
            {
                await _questionServices.DeleteQuestionAsync(id);
                return NoContent();
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

    }
}
