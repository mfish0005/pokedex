using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Entities;
using PokemonApi.Services.DTOs;
using PokemonApi.Tests.Helpers;

namespace PokemonApi.Tests.Services;

public class PokemonServiceTests
{
    [Fact]
    public async Task GetAsync_ReturnsNull_WhenNotFound()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var result = await service.GetAsync(999);
            Assert.Null(result);
        }
    }

    [Fact]
    public async Task GetAsync_ReturnsMappedDto_WhenFound()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, id: 1, name: "charmander", typeName: "fire");

            var result = await service.GetAsync(1);

            Assert.NotNull(result);
            Assert.Equal("charmander", result.Name);
            Assert.Single(result.Types);
            Assert.Equal("fire", result.Types[0].Type.Name);
        }
    }

    [Fact]
    public async Task CreateAsync_AssignsIdAfterMaxExisting()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, id: 151, name: "mew", typeName: "psychic");

            var result = await service.CreateAsync(PokemonInputFactory.Valid("mewtwo"));

            Assert.Equal(152, result.Id);
            Assert.Equal("mewtwo", result.Name);
        }
    }

    [Fact]
    public async Task CreateAsync_StartsAtOne_WhenTableIsEmpty()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var result = await service.CreateAsync(PokemonInputFactory.Valid());

            Assert.Equal(1, result.Id);
        }
    }

    [Fact]
    public async Task CreateAsync_NormalizesNamesAndTrimsText()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var input = PokemonInputFactory.Valid() with
            {
                Name = "  MewTwo ",
                ImageUrl = "  ",
                Types = [new PokemonTypeInput { Name = " Psychic ", Color = "#F85888" }],
                Abilities = [new PokemonAbilityInput { Name = " Pressure " }]
            };

            var result = await service.CreateAsync(input);

            Assert.Equal("mewtwo", result.Name);
            Assert.Null(result.ImageUrl);
            Assert.Equal("psychic", result.Types[0].Type.Name);
            Assert.Equal("pressure", result.Abilities[0].Ability.Name);
        }
    }

    [Fact]
    public async Task CreateAsync_ReusesExistingType()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var fireType = await context.Types.FirstAsync(t => t.Name == "fire");

            var result = await service.CreateAsync(PokemonInputFactory.Valid("flareon", typeName: "fire", typeColor: "#F08030"));

            Assert.Equal("fire", result.Types[0].Type.Name);
            Assert.Equal(fireType.Id, result.Types[0].Type.Id);
            Assert.Equal(18, await context.Types.CountAsync());
        }
    }

    [Fact]
    public async Task CreateAsync_PersistsStatsAndAbilitiesInSlotOrder()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var input = PokemonInputFactory.Valid("eevee", typeName: "normal", typeColor: "#A8A878") with
            {
                Stats = [new PokemonStatInput { Name = "hp", DisplayName = "HP", BaseStat = 55 }],
                Abilities =
                [
                    new PokemonAbilityInput { Name = "run-away" },
                    new PokemonAbilityInput { Name = "anticipation", IsHidden = true }
                ]
            };

            var result = await service.CreateAsync(input);

            Assert.Equal(55, Assert.Single(result.Stats).BaseStat);
            Assert.Equal(["run-away", "anticipation"], result.Abilities.Select(a => a.Ability.Name));
            Assert.Equal([1, 2], result.Abilities.Select(a => a.Slot));

            var inDb = await context.Pokemon
                .Include(p => p.PokemonStats)
                .Include(p => p.PokemonAbilities)
                .FirstAsync(p => p.Id == result.Id);

            Assert.Single(inDb.PokemonStats);
            Assert.Equal(2, inDb.PokemonAbilities.Count);
        }
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenNotFound()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var result = await service.UpdateAsync(99, PokemonInputFactory.Valid());
            Assert.Null(result);
        }
    }

    [Fact]
    public async Task UpdateAsync_ReplacesDetailsAndTypes()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, id: 4, name: "charmander", typeName: "fire");

            var input = PokemonInputFactory.Valid("Charmeleon", typeName: "dragon", typeColor: "#7038F8");

            var result = await service.UpdateAsync(4, input);

            Assert.NotNull(result);
            Assert.Equal("charmeleon", result.Name);
            Assert.Equal("dragon", Assert.Single(result.Types).Type.Name);
        }
    }

    [Fact]
    public async Task IsNameTakenAsync_IgnoresCaseAndTheExcludedPokemon()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, id: 25, name: "pikachu", typeName: "electric");

            Assert.True(await service.IsNameTakenAsync(" PIKACHU ", excludingId: null));
            Assert.False(await service.IsNameTakenAsync("pikachu", excludingId: 25));
            Assert.False(await service.IsNameTakenAsync("raichu", excludingId: null));
        }
    }

    [Fact]
    public async Task GetListAsync_FiltersBySearchTerm()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, 1, "bulbasaur", "grass");
            await SeedPokemonAsync(context, 2, "ivysaur", "grass");
            await SeedPokemonAsync(context, 3, "charmander", "fire");

            var result = await service.GetListAsync(page: 1, pageSize: 10, search: "saur");

            Assert.Equal(2, result.Count);
            Assert.Equal(1, result.TotalPages);
            Assert.All(result.Results, p => Assert.Contains("saur", p.Name));
        }
    }

    [Fact]
    public async Task SearchAsync_ReturnsMatchingPokemon()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, 1, "pikachu", "electric");
            await SeedPokemonAsync(context, 2, "raichu", "electric");

            var results = await service.SearchAsync("chu");

            Assert.Equal(2, results.Count);
        }
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenNotFound()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            var deleted = await service.DeleteAsync(404);
            Assert.False(deleted);
        }
    }

    [Fact]
    public async Task DeleteAsync_ReturnsTrue_AndRemovesPokemon()
    {
        var (service, context) = PokemonTestContextFactory.CreateService();
        await using (context)
        {
            await SeedPokemonAsync(context, 7, "squirtle", "water");

            var deleted = await service.DeleteAsync(7);

            Assert.True(deleted);
            Assert.False(await context.Pokemon.AnyAsync(p => p.Id == 7));
        }
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
        context.ChangeTracker.Clear();
    }
}
