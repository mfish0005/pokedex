using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PokemonApi.Data.Context;
using PokemonApi.Data.Entities;
using PokemonApi.Shared.Models;
using System.Text.Json;

namespace PokemonApi.Data.Seed;

public class PokemonDataSeeder
{
    private readonly PokemonDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly ILogger<PokemonDataSeeder> _logger;
    private const string POKEMON_API_BASE_URL = "https://pokeapi.co/api/v2";

    public PokemonDataSeeder(PokemonDbContext context, HttpClient httpClient, ILogger<PokemonDataSeeder> logger)
    {
        _context = context;
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task SeedPokemonDataAsync(int count = 151)
    {
        try
        {
            _logger.LogInformation("Starting Pokemon data seeding...");
            
            if (await _context.Pokemon.AnyAsync())
            {
                _logger.LogInformation("Pokemon data already exists. Skipping seeding.");
                return;
            }
                        
            await SeedPokemonAsync(count);

            _logger.LogInformation("Pokemon data seeding completed successfully!");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while seeding Pokemon data");
            throw;
        }
    }

    private async Task SeedPokemonAsync(int count)
    {
        var pokemonList = new List<Pokemon>();
        var pokemonTypes = new List<PokemonType>();
        var pokemonStats = new List<PokemonStat>();
        var pokemonAbilities = new List<PokemonAbility>();

        for (int i = 1; i <= count; i++)
        {
            try
            {
                _logger.LogInformation($"Fetching Pokemon {i}/{count}...");

                var pokemonData = await FetchPokemonDataAsync(i);
                if (pokemonData == null) continue;
                
                var pokemon = new Pokemon
                {
                    Id = pokemonData.Id,
                    Name = pokemonData.Name,
                    Height = pokemonData.Height,
                    Weight = pokemonData.Weight,
                    BaseExperience = pokemonData.Base_Experience,
                    Order = pokemonData.Order,
                    ImageUrl = pokemonData.Sprites?.Other?.Official_Artwork?.Front_Default 
                              ?? pokemonData.Sprites?.Front_Default,
                    ShinyImageUrl = pokemonData.Sprites?.Other?.Official_Artwork?.Front_Shiny 
                                   ?? pokemonData.Sprites?.Front_Shiny
                };

                pokemonList.Add(pokemon);
                
                foreach (var type in pokemonData.Types)
                {
                    var typeId = await GetTypeIdByNameAsync(type.Type.Name);
                    if (typeId.HasValue)
                    {
                        pokemonTypes.Add(new PokemonType
                        {
                            PokemonId = pokemon.Id,
                            TypeId = typeId.Value,
                            Slot = type.Slot
                        });
                    }
                }
                
                foreach (var stat in pokemonData.Stats)
                {
                    var statId = await GetStatIdByNameAsync(stat.Stat.Name);
                    if (statId.HasValue)
                    {
                        pokemonStats.Add(new PokemonStat
                        {
                            PokemonId = pokemon.Id,
                            StatId = statId.Value,
                            BaseStat = stat.Base_Stat,
                            Effort = stat.Effort
                        });
                    }
                }
                
                foreach (var ability in pokemonData.Abilities)
                {
                    var abilityId = await GetOrCreateAbilityAsync(ability.Ability.Name);
                    pokemonAbilities.Add(new PokemonAbility
                    {
                        PokemonId = pokemon.Id,
                        AbilityId = abilityId,
                        IsHidden = ability.Is_Hidden,
                        Slot = ability.Slot
                    });
                }
                
                await Task.Delay(100);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching Pokemon {i}");
                continue;
            }
        }
        
        await SaveDataInBatchesAsync(pokemonList, pokemonTypes, pokemonStats, pokemonAbilities);
    }

    private async Task<PokemonApiResponse?> FetchPokemonDataAsync(int id)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{POKEMON_API_BASE_URL}/pokemon/{id}");
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning($"Failed to fetch Pokemon {id}: {response.StatusCode}");
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            return JsonSerializer.Deserialize<PokemonApiResponse>(json, options);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error fetching Pokemon data for ID {id}");
            return null;
        }
    }

    private async Task<int?> GetTypeIdByNameAsync(string typeName)
    {
        var type = await _context.Types.FirstOrDefaultAsync(t => t.Name == typeName);
        return type?.Id;
    }

    private async Task<int?> GetStatIdByNameAsync(string statName)
    {
        var stat = await _context.Stats.FirstOrDefaultAsync(s => s.Name == statName);
        return stat?.Id;
    }

    private async Task<int> GetOrCreateAbilityAsync(string abilityName)
    {
        var ability = await _context.Abilities.FirstOrDefaultAsync(a => a.Name == abilityName);
        if (ability == null)
        {
            ability = new Ability { Name = abilityName };
            _context.Abilities.Add(ability);
            await _context.SaveChangesAsync();
        }
        return ability.Id;
    }


    private async Task SaveDataInBatchesAsync(
        List<Pokemon> pokemon,
        List<PokemonType> pokemonTypes,
        List<PokemonStat> pokemonStats,
        List<PokemonAbility> pokemonAbilities)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _logger.LogInformation("Saving Pokemon data...");
            
            await _context.Pokemon.AddRangeAsync(pokemon);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Saving Pokemon types...");
            await _context.PokemonTypes.AddRangeAsync(pokemonTypes);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Saving Pokemon stats...");
            await _context.PokemonStats.AddRangeAsync(pokemonStats);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Saving Pokemon abilities...");
            await _context.PokemonAbilities.AddRangeAsync(pokemonAbilities);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            _logger.LogInformation($"Successfully saved {pokemon.Count} Pokemon with all related data!");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error saving Pokemon data, transaction rolled back");
            throw;
        }
    }
}
