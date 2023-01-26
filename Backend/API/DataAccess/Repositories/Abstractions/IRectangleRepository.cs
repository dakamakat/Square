using Models.Entities;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Abstractions
{
    public interface IRectangleRepository
    {
        Task<Rectangle> GetRectangleAsync();

        Task SaveRectangleAsync(Rectangle rectangle);
    }
}
