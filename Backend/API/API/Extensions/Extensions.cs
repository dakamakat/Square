using BusinessLogic.Services.Abstractions;
using BusinessLogic.Services.Implementations;
using DataAccess.Repositories.Abstractions;
using DataAccess.Repositories.Implementations;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class Extensions
    {
        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddSingleton<IJsonService, JsonService>();
            services.AddSingleton<IRectangleRepository, RectangleRepository>();
        }
    }
}