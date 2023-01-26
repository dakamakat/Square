using BusinessLogic.Options;
using BusinessLogic.Services.Abstractions;
using System.IO;
using System.Threading.Tasks;

namespace BusinessLogic.Services.Implementations
{
    public class JsonService : IJsonService
    {
        public async Task<string> ReadJsonAsync()
        {
            try
            {
                var data = await File.ReadAllTextAsync(JsonOptions.FILE_NAME);

                return !string.IsNullOrWhiteSpace(data) ? data : throw new FileNotFoundException();
            }
            catch (FileNotFoundException)
            {
                return JsonOptions.DEFAULT_DATA;
            }
        }

        public async Task UpdateJsonAsync(string data)
        {
            await File.WriteAllTextAsync(JsonOptions.FILE_NAME, string.IsNullOrWhiteSpace(data) ? JsonOptions.DEFAULT_DATA : data);
        }
    }
}
