using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class OptionController : ControllerBase
    {
        private readonly IOptionServices _optionServices;

        public OptionController(IOptionServices optionServices)
        {
            _optionServices = optionServices;
        }

        [HttpPost]
        public async Task<IActionResult> AddOption([FromBody] CreateOptionModel createOptionModel)
        {
            try
            {
                await _optionServices.AddOption(createOptionModel);
                return Created();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
