using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PaperController : ControllerBase
    {
        private readonly IPaperServices _paperServices;

        public PaperController(IPaperServices paperServices)
        {
            _paperServices = paperServices;
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
                await _paperServices.GetPaperWithQuestions(paperId);
                return Created();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
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
    }
}
