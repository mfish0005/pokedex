using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Context;
using PokemonApi.Data.Repositories;
using PokemonApi.Services.Services;

namespace PokemonApi.Tests.Helpers;

public static class PokemonTestContextFactory
{
    public static (PokemonService Service, PokemonDbContext Context) CreateService()
    {
        var options = new DbContextOptionsBuilder<PokemonDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new PokemonDbContext(options);
        context.Database.EnsureCreated();

        var service = new PokemonService(new PokemonRepository(context));

        return (service, context);
    }
}
