using BusinessLogic.Services.Abstractions;
using DataAccess.Repositories.Abstractions;
using Models.Entities;
using System.Text.Json;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Implementations
{
    public class RectangleRepository : IRectangleRepository
    {
        private readonly IJsonService _jsonService;

        public RectangleRepository(IJsonService jsonService)
        {
            _jsonService = jsonService;
        }

        public async Task<Rectangle> GetRectangleAsync()
        {
            var data = await _jsonService.ReadJsonAsync();

            var rect = JsonSerializer.Deserialize<Rectangle>(data);

            return rect;
        }

        public async Task SaveRectangleAsync(Rectangle rectangle)
        {
            var data = JsonSerializer.Serialize(rectangle);
            await _jsonService.UpdateJsonAsync(data);
        }
    }
}
