using DataAccess.Repositories.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Models.Entities;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class ApiController : ControllerBase
    {
        private IRectangleRepository _repository;

        public ApiController(IRectangleRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetRectangle()
        {
                var rect = await _repository.GetRectangleAsync();

            if (rect is null)
            {
                return BadRequest();
            }

            return Ok(rect);
        }

        [HttpPost]
        public async Task<IActionResult> SaveRectangle([FromBody] Rectangle rectangle)
        {
            await _repository.SaveRectangleAsync(rectangle);

            return Ok();
        }
    }
}
