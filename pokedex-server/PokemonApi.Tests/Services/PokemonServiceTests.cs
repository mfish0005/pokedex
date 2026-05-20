using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Entities;
using PokemonApi.Services.DTOs;
using PokemonApi.Tests.Helpers;

namespace PokemonApi.Tests.Services;

public class PokemonServiceTests
{
    [Fact]
    public async Task GetPokemonByIdAsync_ReturnsNull_WhenNotFound()
    {
        var (service, _, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var result = await service.GetPokemonByIdAsync(999);
            Assert.Null(result);
        }
    }

    [Fact]
    public async Task GetPokemonByIdAsync_ReturnsMappedDto_WhenFound()
    {
        var (service, _, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, id: 1, name: "charmander", typeName: "fire");

            var result = await service.GetPokemonByIdAsync(1);

            Assert.NotNull(result);
            Assert.Equal("charmander", result.Name);
            Assert.Single(result.Types);
            Assert.Equal("fire", result.Types[0].Type.Name);
        }
    }

    [Fact]
    public async Task CreatePokemonAsync_AssignsIdAfterMaxExisting()
    {
        var (service, _, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, id: 151, name: "mew", typeName: "psychic");

            var createDto = BuildCreateDto("mewtwo", typeName: "psychic", typeColor: "#F85888");

            var result = await service.CreatePokemonAsync(createDto);

            Assert.Equal(152, result.Id);
            Assert.Equal("mewtwo", result.Name);
        }
    }

    [Fact]
    public async Task CreatePokemonAsync_ReusesExistingType()
    {
        var (service, _, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var fireType = await context.Types.FirstAsync(t => t.Name == "fire");

            var createDto = BuildCreateDto("flareon", typeName: "fire", typeColor: "#F08030");

            var result = await service.CreatePokemonAsync(createDto);

            Assert.Equal("fire", result.Types[0].Type.Name);
            Assert.Equal(fireType.Id, result.Types[0].Type.Id);
        }
    }

    [Fact]
    public async Task CreatePokemonAsync_PersistsStatsAndAbilities()
    {
        var (service, _, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var createDto = BuildCreateDto("eevee", typeName: "normal", typeColor: "#A8A878");
            createDto.Stats =
            [
                new CreatePokemonStatDto { Name = "hp", DisplayName = "HP", BaseStat = 55 }
            ];
            createDto.Abilities =
            [
                new CreatePokemonAbilityDto { Name = "run-away", IsHidden = false }
            ];

            var result = await service.CreatePokemonAsync(createDto);

            Assert.Single(result.Stats);
            Assert.Equal(55, result.Stats[0].BaseStat);
            Assert.Single(result.Abilities);
            Assert.Equal("run-away", result.Abilities[0].Ability.Name);

            var inDb = await context.Pokemon
                .Include(p => p.PokemonStats)
                .Include(p => p.PokemonAbilities)
                .FirstAsync(p => p.Id == result.Id);

            Assert.Single(inDb.PokemonStats);
            Assert.Single(inDb.PokemonAbilities);
        }
    }

    [Fact]
    public async Task GetPokemonListAsync_FiltersBySearchTerm()
    {
        var (service, _, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, 1, "bulbasaur", "grass");
            await SeedPokemonAsync(context, 2, "ivysaur", "grass");
            await SeedPokemonAsync(context, 3, "charmander", "fire");

            var result = await service.GetPokemonListAsync(page: 1, pageSize: 10, search: "saur");

            Assert.Equal(2, result.Count);
            Assert.All(result.Results, p => Assert.Contains("saur", p.Name));
        }
    }

    [Fact]
    public async Task SearchPokemonAsync_ReturnsMatchingPokemon()
    {
        var (service, _, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, 1, "pikachu", "electric");
            await SeedPokemonAsync(context, 2, "raichu", "electric");

            var results = await service.SearchPokemonAsync("chu");

            Assert.Equal(2, results.Count);
        }
    }

    [Fact]
    public async Task DeletePokemonAsync_ReturnsFalse_WhenNotFound()
    {
        var (service, _, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var deleted = await service.DeletePokemonAsync(404);
            Assert.False(deleted);
        }
    }

    [Fact]
    public async Task DeletePokemonAsync_ReturnsTrue_AndRemovesPokemon()
    {
        var (service, _, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, 7, "squirtle", "water");

            var deleted = await service.DeletePokemonAsync(7);

            Assert.True(deleted);
            Assert.False(await context.Pokemon.AnyAsync(p => p.Id == 7));
        }
    }

    [Fact]
    public async Task UpdatePokemonAsync_ReturnsNull_WhenNotFound()
    {
        var (service, _, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var result = await service.UpdatePokemonAsync(99, new UpdatePokemonDto { Name = "missing" });
            Assert.Null(result);
        }
    }

    private static CreatePokemonDto BuildCreateDto(
        string name,
        string typeName,
        string typeColor)
    {
        return new CreatePokemonDto
        {
            Name = name,
            Height = 10,
            Weight = 100,
            BaseExperience = 50,
            Types =
            [
                new CreatePokemonTypeDto { Name = typeName, Color = typeColor }
            ]
        };
    }

    private static async Task SeedPokemonAsync(
        PokemonApi.Data.Context.PokemonDbContext context,
        int id,
        string name,
        string typeName)
    {
        var type = await context.Types.FirstAsync(t => t.Name == typeName);

        context.Pokemon.Add(new Pokemon
        {
            Id = id,
            Name = name,
            Height = 7,
            Weight = 69,
            BaseExperience = 64
        });

        context.PokemonTypes.Add(new PokemonType
        {
            PokemonId = id,
            TypeId = type.Id,
            Slot = 1
        });

        await context.SaveChangesAsync();
    }
}
