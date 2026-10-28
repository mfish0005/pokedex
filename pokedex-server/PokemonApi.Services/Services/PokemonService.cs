using PokemonApi.Data.Entities;
using PokemonApi.Data.Repositories;
using PokemonApi.Services.DTOs;
using PokemonApi.Services.Interfaces;

namespace PokemonApi.Services.Services;

public class PokemonService(IPokemonRepository repository) : IPokemonService
{
    private const int SearchLimit = 10;

    public async Task<PokemonListDto> GetListAsync(int page, int pageSize, string? search, CancellationToken cancellationToken = default)
    {
        var result = await repository.ListAsync(page, pageSize, search, cancellationToken);

        return new PokemonListDto
        {
            Count = result.TotalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)result.TotalCount / pageSize),
            Results = result.Items.Select(MapToSummaryDto).ToList()
        };
    }

    public async Task<PokemonDto?> GetAsync(int id, CancellationToken cancellationToken = default)
    {
        var pokemon = await repository.GetAsync(id, cancellationToken);

        return pokemon is null ? null : MapToDto(pokemon);
    }

    public async Task<PokemonDto?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        var pokemon = await repository.GetByNameAsync(name, cancellationToken);

        return pokemon is null ? null : MapToDto(pokemon);
    }

    public async Task<List<PokemonSummaryDto>> SearchAsync(string term, CancellationToken cancellationToken = default)
    {
        var pokemon = await repository.SearchAsync(term, SearchLimit, cancellationToken);

        return pokemon.Select(MapToSummaryDto).ToList();
    }

    public Task<bool> IsNameTakenAsync(string name, int? excludingId, CancellationToken cancellationToken = default) =>
        repository.NameExistsAsync(name, excludingId, cancellationToken);

    public async Task<PokemonDto> CreateAsync(PokemonInput input, CancellationToken cancellationToken = default)
    {
        var pokemon = new Pokemon { Id = await repository.NextIdAsync(cancellationToken) };

        await ApplyAsync(pokemon, input, cancellationToken);
        await repository.AddAsync(pokemon, cancellationToken);

        return MapToDto(pokemon);
    }

    public async Task<PokemonDto?> UpdateAsync(int id, PokemonInput input, CancellationToken cancellationToken = default)
    {
        var pokemon = await repository.GetAsync(id, cancellationToken);

        if (pokemon is null)
        {
            return null;
        }

        await ApplyAsync(pokemon, input, cancellationToken);
        await repository.UpdateAsync(pokemon, cancellationToken);

        return MapToDto(pokemon);
    }

    public Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default) =>
        repository.DeleteAsync(id, cancellationToken);

    private async Task ApplyAsync(Pokemon pokemon, PokemonInput input, CancellationToken cancellationToken)
    {
        pokemon.Name = Normalize(input.Name!);
        pokemon.Height = input.Height!.Value;
        pokemon.Weight = input.Weight!.Value;
        pokemon.BaseExperience = input.BaseExperience!.Value;
        pokemon.ImageUrl = string.IsNullOrWhiteSpace(input.ImageUrl) ? null : input.ImageUrl.Trim();

        pokemon.PokemonTypes.Clear();
        pokemon.PokemonStats.Clear();
        pokemon.PokemonAbilities.Clear();

        var types = input.Types ?? [];
        for (var i = 0; i < types.Count; i++)
        {
            var name = Normalize(types[i].Name!);
            var type = await repository.FindTypeAsync(name, cancellationToken)
                ?? new Data.Entities.Type { Name = name, Color = types[i].Color!.Trim() };

            pokemon.PokemonTypes.Add(new PokemonType { Type = type, Slot = i + 1 });
        }

        foreach (var statInput in input.Stats ?? [])
        {
            var name = Normalize(statInput.Name!);
            var stat = await repository.FindStatAsync(name, cancellationToken)
                ?? new Stat { Name = name, DisplayName = statInput.DisplayName!.Trim() };

            pokemon.PokemonStats.Add(new PokemonStat { Stat = stat, BaseStat = statInput.BaseStat!.Value });
        }

        var abilities = input.Abilities ?? [];
        for (var i = 0; i < abilities.Count; i++)
        {
            var name = Normalize(abilities[i].Name!);
            var ability = await repository.FindAbilityAsync(name, cancellationToken)
                ?? new Ability { Name = name };

            pokemon.PokemonAbilities.Add(new PokemonAbility { Ability = ability, IsHidden = abilities[i].IsHidden, Slot = i + 1 });
        }
    }

    private static string Normalize(string name) => name.Trim().ToLowerInvariant();

    private static PokemonDto MapToDto(Pokemon pokemon)
    {
        return new PokemonDto
        {
            Id = pokemon.Id,
            Name = pokemon.Name,
            Height = pokemon.Height,
            Weight = pokemon.Weight,
            BaseExperience = pokemon.BaseExperience,
            Order = pokemon.Order,
            ImageUrl = pokemon.ImageUrl,
            ShinyImageUrl = pokemon.ShinyImageUrl,
            Types = pokemon.PokemonTypes
                .OrderBy(pt => pt.Slot)
                .Select(pt => new PokemonTypeDto
                {
                    Slot = pt.Slot,
                    Type = new TypeDto
                    {
                        Id = pt.Type.Id,
                        Name = pt.Type.Name,
                        Color = pt.Type.Color ?? string.Empty
                    }
                }).ToList(),
            Stats = pokemon.PokemonStats
                .Select(ps => new PokemonStatDto
                {
                    BaseStat = ps.BaseStat,
                    Effort = ps.Effort,
                    Stat = new StatDto
                    {
                        Id = ps.Stat.Id,
                        Name = ps.Stat.Name,
                        DisplayName = ps.Stat.DisplayName ?? string.Empty
                    }
                }).ToList(),
            Abilities = pokemon.PokemonAbilities
                .OrderBy(pa => pa.Slot)
                .Select(pa => new PokemonAbilityDto
                {
                    IsHidden = pa.IsHidden,
                    Slot = pa.Slot,
                    Ability = new AbilityDto
                    {
                        Id = pa.Ability.Id,
                        Name = pa.Ability.Name,
                        Description = pa.Ability.Description
                    }
                }).ToList()
        };
    }

    private static PokemonSummaryDto MapToSummaryDto(Pokemon pokemon)
    {
        return new PokemonSummaryDto
        {
            Id = pokemon.Id,
            Name = pokemon.Name,
            ImageUrl = pokemon.ImageUrl,
            Types = pokemon.PokemonTypes
                .OrderBy(pt => pt.Slot)
                .Select(pt => new TypeDto
                {
                    Id = pt.Type.Id,
                    Name = pt.Type.Name,
                    Color = pt.Type.Color ?? string.Empty
                }).ToList()
        };
    }
}
