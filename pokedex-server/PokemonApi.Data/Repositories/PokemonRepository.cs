using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Context;
using PokemonApi.Data.Entities;
using PokemonApi.Data.Repositories.Interfaces;

namespace PokemonApi.Data.Repositories;

public class PokemonRepository : Repository<Pokemon>, IPokemonRepository
{
    public PokemonRepository(PokemonDbContext context) : base(context)
    {
    }

    public IQueryable<Pokemon> GetQueryable()
    {
        return _dbSet.AsQueryable();
    }

    public async Task<Pokemon?> GetPokemonWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(p => p.PokemonTypes)
                .ThenInclude(pt => pt.Type)
            .Include(p => p.PokemonStats)
                .ThenInclude(ps => ps.Stat)
            .Include(p => p.PokemonAbilities)
                .ThenInclude(pa => pa.Ability)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Pokemon>> GetPokemonWithDetailsAsync()
    {
        return await _dbSet
            .Include(p => p.PokemonTypes)
                .ThenInclude(pt => pt.Type)
            .Include(p => p.PokemonStats)
                .ThenInclude(ps => ps.Stat)
            .Include(p => p.PokemonAbilities)
                .ThenInclude(pa => pa.Ability)
            .OrderBy(p => p.Id)
            .ToListAsync();
    }

    public async Task<IEnumerable<Pokemon>> GetPokemonPagedWithDetailsAsync(int page, int pageSize)
    {
        return await _dbSet
            .Include(p => p.PokemonTypes)
                .ThenInclude(pt => pt.Type)
            .Include(p => p.PokemonStats)
                .ThenInclude(ps => ps.Stat)
            .Include(p => p.PokemonAbilities)
                .ThenInclude(pa => pa.Ability)
            .OrderBy(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Pokemon>> SearchPokemonByNameAsync(string name)
    {
        return await _dbSet
            .Include(p => p.PokemonTypes)
                .ThenInclude(pt => pt.Type)
            .Where(p => p.Name.ToLower().Contains(name.ToLower()))
            .OrderBy(p => p.Id)
            .ToListAsync();
    }

    public async Task<Pokemon?> GetPokemonByNameAsync(string name)
    {
        return await _dbSet
            .Include(p => p.PokemonTypes)
                .ThenInclude(pt => pt.Type)
            .Include(p => p.PokemonStats)
                .ThenInclude(ps => ps.Stat)
            .Include(p => p.PokemonAbilities)
                .ThenInclude(pa => pa.Ability)
            .FirstOrDefaultAsync(p => p.Name.ToLower() == name.ToLower());
    }

    public async Task<Pokemon?> GetNextPokemonAsync(int currentId)
    {
        return await _dbSet
            .Where(p => p.Id > currentId)
            .OrderBy(p => p.Id)
            .FirstOrDefaultAsync();
    }

    public async Task<Pokemon?> GetPreviousPokemonAsync(int currentId)
    {
        return await _dbSet
            .Where(p => p.Id < currentId)
            .OrderByDescending(p => p.Id)
            .FirstOrDefaultAsync();
    }
}
