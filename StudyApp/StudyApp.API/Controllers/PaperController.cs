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
    }
}
