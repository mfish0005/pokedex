using Microsoft.Extensions.DependencyInjection;
using PokemonApi.Data.Repositories;
using PokemonApi.Services.Interfaces;
using PokemonApi.Services.Services;

namespace PokemonApi.Services;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPokemonServices(this IServiceCollection services)
    {
        services.AddScoped<IPokemonRepository, PokemonRepository>();
        services.AddScoped<IPokemonService, PokemonService>();

        return services;
    }
}
