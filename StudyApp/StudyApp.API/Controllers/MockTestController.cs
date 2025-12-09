using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Dto;
using StudyApp.API.Models;
using StudyApp.API.Services.Implementations;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MockTestController : ControllerBase
    {
        private readonly IMockServices _mockServices;
        private readonly IMockQuestionServices _mockQuestionServices;
        private readonly IMockOptionServices _mockOptionServices;
        private readonly ITestResultServices _testResultServices;

        public MockTestController(IMockServices mockServices, IMockQuestionServices mockQuestionServices, IMockOptionServices mockOptionServices, ITestResultServices testResultServices)
        {
            _mockServices = mockServices;
            _mockQuestionServices = mockQuestionServices;
            _mockOptionServices = mockOptionServices;
            _testResultServices = testResultServices;
        }

        [HttpPost]
        public async Task<IActionResult> AddMockPaper([FromBody] CreateMockTestDto model)
        {
            try
            {
                await _mockServices.AddMockPaper(model);
                return Created();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetMockPaper()
        {
            try
            {
                IEnumerable<CreateMockTestDto> mockTests = await _mockServices.GetMockPapers();
                return Ok(mockTests);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        //Mock Questions
        [HttpPost]
        public async Task<IActionResult> AddMockQuestion([FromBody] MockQuestionModel model)
        {
            try
            {
                await _mockQuestionServices.AddMockQuestion(model);
                return Created();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{mockPaperId}")]

        public async Task<IActionResult> GetMockQuestionsForPaper(int mockPaperId)
        {
            try
            {
                List<MockQuestionModel> questions = await _mockQuestionServices.GetMockQuestionsForPaperAsync(mockPaperId);
                return Ok(questions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Add Options for Mock Questions
        [HttpPost]
        public async Task<IActionResult> AddMockOption([FromBody] CreateMockOptionModel createMockOptionModel)
        {
            try
            {
                await _mockOptionServices.AddMockOption(createMockOptionModel);
                return Created();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Mock Test Attempt

        [HttpPost]
        public async Task<IActionResult> AttemptMockTest([FromBody] SubmitTestDto model)
        {
            try
            {
                var result = await _testResultServices.SubmitTestAsync(model);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]


        [HttpGet("{mockPaperId}")]

        public async Task<IActionResult> GetAllMockTests()
        {
            try
            {
                List<MockTestSummaryDto> questions = await _mockServices.GetAllMockTestsAsync();
                return Ok(questions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Admin side code to show mock resut with questions and answers
        [HttpGet("{testResultId}")]
        public async Task<IActionResult> GetMockTestWithQuestions(int testResultId)
        {
            try
            {
                var mockresult = await _testResultServices.GetTestResultForAdminAsync(testResultId);
                return Ok(mockresult);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetMockResults()
        {
            try
            {
                IEnumerable<MockTestResultModel> mockresult = await _testResultServices.GetAllMockTestResults();
                return Ok(mockresult);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

    }
}
