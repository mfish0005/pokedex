using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Repositories.Interfaces;
using PokemonApi.Services.DTOs;
using PokemonApi.Services.Interfaces;

namespace PokemonApi.Services.Services;

public class PokemonService : IPokemonService
{
    private readonly IUnitOfWork _unitOfWork;

    public PokemonService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PokemonListDto> GetPokemonListAsync(int page = 1, int pageSize = 20, string? search = null)
    {
        var query = _unitOfWork.Pokemon.GetQueryable()
            .Include(p => p.PokemonTypes)
                .ThenInclude(pt => pt.Type)
            .Include(p => p.PokemonStats)
                .ThenInclude(ps => ps.Stat)
            .Include(p => p.PokemonAbilities)
                .ThenInclude(pa => pa.Ability)
            .AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(p => p.Name.Contains(search));
        }

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var pokemon = await query
            .OrderBy(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var results = pokemon.Select(MapToSummaryDto).ToList();

        return new PokemonListDto
        {
            Count = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages,
            Results = results
        };
    }

    public async Task<PokemonDto?> GetPokemonByIdAsync(int id)
    {
        var pokemon = await _unitOfWork.Pokemon.GetQueryable()
            .Include(p => p.PokemonTypes)
                .ThenInclude(pt => pt.Type)
            .Include(p => p.PokemonStats)
                .ThenInclude(ps => ps.Stat)
            .Include(p => p.PokemonAbilities)
                .ThenInclude(pa => pa.Ability)
            .FirstOrDefaultAsync(p => p.Id == id);

        return pokemon != null ? MapToDto(pokemon) : null;
    }

    public async Task<PokemonDto?> GetPokemonByNameAsync(string name)
    {
        var pokemon = await _unitOfWork.Pokemon.GetQueryable()
            .Include(p => p.PokemonTypes)
                .ThenInclude(pt => pt.Type)
            .Include(p => p.PokemonStats)
                .ThenInclude(ps => ps.Stat)
            .Include(p => p.PokemonAbilities)
                .ThenInclude(pa => pa.Ability)
            .FirstOrDefaultAsync(p => p.Name.ToLower() == name.ToLower());

        return pokemon != null ? MapToDto(pokemon) : null;
    }

    public async Task<List<PokemonSummaryDto>> SearchPokemonAsync(string searchTerm)
    {
        var pokemon = await _unitOfWork.Pokemon.GetQueryable()
            .Include(p => p.PokemonTypes)
                .ThenInclude(pt => pt.Type)
            .Where(p => p.Name.Contains(searchTerm))
            .OrderBy(p => p.Name)
            .Take(10)
            .ToListAsync();

        return pokemon.Select(MapToSummaryDto).ToList();
    }

    private static PokemonDto MapToDto(Data.Entities.Pokemon pokemon)
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
                        Color = pt.Type.Color
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
                        DisplayName = ps.Stat.DisplayName
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

    private static PokemonSummaryDto MapToSummaryDto(Data.Entities.Pokemon pokemon)
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
                    Color = pt.Type.Color
                }).ToList()
        };
    }

    public async Task<PokemonDto> CreatePokemonAsync(CreatePokemonDto createDto)
    {        
        var maxId = await _unitOfWork.Pokemon.GetQueryable()
            .AnyAsync() 
            ? await _unitOfWork.Pokemon.GetQueryable().MaxAsync(p => p.Id)
            : 0;
        var nextId = maxId + 1;

        var pokemon = new Data.Entities.Pokemon
        {
            Id = nextId,
            Name = createDto.Name,
            Height = createDto.Height,
            Weight = createDto.Weight,
            BaseExperience = createDto.BaseExperience,
            ImageUrl = createDto.ImageUrl,
            PokemonTypes = new List<Data.Entities.PokemonType>(),
            PokemonStats = new List<Data.Entities.PokemonStat>(),
            PokemonAbilities = new List<Data.Entities.PokemonAbility>()
        };
        
        foreach (var typeDto in createDto.Types)
        {
            var type = await _unitOfWork.Types.GetByNameAsync(typeDto.Name) 
                ?? new Data.Entities.Type { Name = typeDto.Name, Color = typeDto.Color };
            
            if (type.Id == 0)
            {
                await _unitOfWork.Types.AddAsync(type);
            }

            pokemon.PokemonTypes.Add(new Data.Entities.PokemonType
            {
                Pokemon = pokemon,
                Type = type
            });
        }

        foreach (var statDto in createDto.Stats)
        {
            var stat = await _unitOfWork.Stats.GetByNameAsync(statDto.Name)
                ?? new Data.Entities.Stat { Name = statDto.Name, DisplayName = statDto.DisplayName };
            
            if (stat.Id == 0)
            {
                await _unitOfWork.Stats.AddAsync(stat);
            }

            pokemon.PokemonStats.Add(new Data.Entities.PokemonStat
            {
                Pokemon = pokemon,
                Stat = stat,
                BaseStat = statDto.BaseStat
            });
        }

        foreach (var abilityDto in createDto.Abilities)
        {
            var ability = await _unitOfWork.Abilities.GetByNameAsync(abilityDto.Name)
                ?? new Data.Entities.Ability { Name = abilityDto.Name };
            
            if (ability.Id == 0)
            {
                await _unitOfWork.Abilities.AddAsync(ability);
            }

            pokemon.PokemonAbilities.Add(new Data.Entities.PokemonAbility
            {
                Pokemon = pokemon,
                Ability = ability,
                IsHidden = abilityDto.IsHidden
            });
        }

        await _unitOfWork.Pokemon.AddAsync(pokemon);
        await _unitOfWork.SaveChangesAsync();

        var createdPokemon = await _unitOfWork.Pokemon.GetQueryable()
            .Include(p => p.PokemonTypes).ThenInclude(pt => pt.Type)
            .Include(p => p.PokemonStats).ThenInclude(ps => ps.Stat)
            .Include(p => p.PokemonAbilities).ThenInclude(pa => pa.Ability)
            .FirstAsync(p => p.Id == pokemon.Id);

        return MapToDto(createdPokemon);
    }

    public async Task<PokemonDto?> UpdatePokemonAsync(int id, UpdatePokemonDto updateDto)
    {
        var pokemon = await _unitOfWork.Pokemon.GetQueryable()
            .Include(p => p.PokemonTypes).ThenInclude(pt => pt.Type)
            .Include(p => p.PokemonStats).ThenInclude(ps => ps.Stat)
            .Include(p => p.PokemonAbilities).ThenInclude(pa => pa.Ability)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pokemon == null)
            return null;

        pokemon.Name = updateDto.Name;
        pokemon.Height = updateDto.Height;
        pokemon.Weight = updateDto.Weight;
        pokemon.BaseExperience = updateDto.BaseExperience;
        pokemon.ImageUrl = updateDto.ImageUrl;

        pokemon.PokemonTypes.Clear();
        pokemon.PokemonStats.Clear();
        pokemon.PokemonAbilities.Clear();

        foreach (var typeDto in updateDto.Types)
        {
            var type = await _unitOfWork.Types.GetByNameAsync(typeDto.Name) 
                ?? new Data.Entities.Type { Name = typeDto.Name, Color = typeDto.Color };
            
            if (type.Id == 0)
            {
                await _unitOfWork.Types.AddAsync(type);
            }

            pokemon.PokemonTypes.Add(new Data.Entities.PokemonType
            {
                Pokemon = pokemon,
                Type = type
            });
        }

        foreach (var statDto in updateDto.Stats)
        {
            var stat = await _unitOfWork.Stats.GetByNameAsync(statDto.Name)
                ?? new Data.Entities.Stat { Name = statDto.Name, DisplayName = statDto.DisplayName };
            
            if (stat.Id == 0)
            {
                await _unitOfWork.Stats.AddAsync(stat);
            }

            pokemon.PokemonStats.Add(new Data.Entities.PokemonStat
            {
                Pokemon = pokemon,
                Stat = stat,
                BaseStat = statDto.BaseStat
            });
        }

        foreach (var abilityDto in updateDto.Abilities)
        {
            var ability = await _unitOfWork.Abilities.GetByNameAsync(abilityDto.Name)
                ?? new Data.Entities.Ability { Name = abilityDto.Name };
            
            if (ability.Id == 0)
            {
                await _unitOfWork.Abilities.AddAsync(ability);
            }

            pokemon.PokemonAbilities.Add(new Data.Entities.PokemonAbility
            {
                Pokemon = pokemon,
                Ability = ability,
                IsHidden = abilityDto.IsHidden
            });
        }

        await _unitOfWork.SaveChangesAsync();
        return MapToDto(pokemon);
    }

    public async Task<bool> DeletePokemonAsync(int id)
    {
        var pokemon = await _unitOfWork.Pokemon.GetByIdAsync(id);
        if (pokemon == null)
            return false;

        await _unitOfWork.Pokemon.DeleteAsync(pokemon);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
