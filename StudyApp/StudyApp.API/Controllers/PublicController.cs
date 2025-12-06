using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        private readonly IContactServices _contactServices;

        private readonly ISubscriberServices _subscriberServices;

        public PublicController(IContactServices contactServices, ISubscriberServices subscriberServices)
        {
            _contactServices = contactServices;
            _subscriberServices = subscriberServices;
        }

        //Contact Endpoint
        [HttpPost]
        public async Task<IActionResult> AddContactInfo([FromBody] ContactMessageModel model)
        {
            try
            {
                await _contactServices.SendContactInfo(model);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetContactInfo()
        {
            try
            {
                IEnumerable<ContactMessageModel> contactMessages = await _contactServices.GetContactInfo();
                return Ok(contactMessages);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        //Subscriber Endpoint

        [HttpPost]
        public async Task<IActionResult> AddSubscriber([FromBody] SubscriberModel model)
        {
            try
            {
                await _subscriberServices.AddSubscriber(model);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }



        [HttpGet]
        public async Task<IActionResult> GetSubscriber()
        {
            try
            {
                IEnumerable<SubscriberModel> contactMessages = await _subscriberServices.GetSubscriberInfo();
                return Ok(contactMessages);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
