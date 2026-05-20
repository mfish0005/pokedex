using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Context;
using PokemonApi.Data.Repositories;
using PokemonApi.Data.Repositories.Interfaces;
using PokemonApi.Services.Services;

namespace PokemonApi.Tests.Helpers;

public static class PokemonTestContextFactory
{
    public static (PokemonService Service, IUnitOfWork UnitOfWork, PokemonDbContext Context) CreateService()
    {
        var options = new DbContextOptionsBuilder<PokemonDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new PokemonDbContext(options);
        context.Database.EnsureCreated();

        var unitOfWork = new UnitOfWork(context);
        var service = new PokemonService(unitOfWork);

        return (service, unitOfWork, context);
    }
}
