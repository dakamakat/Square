using System.Threading.Tasks;

namespace BusinessLogic.Services.Abstractions
{
    public interface IJsonService
    {
        Task<string> ReadJsonAsync();

        Task UpdateJsonAsync(string data);
    }
}
