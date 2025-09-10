using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Context;
using PokemonApi.Data.Entities;
using PokemonApi.Data.Repositories.Interfaces;

namespace PokemonApi.Data.Repositories;

public class StatRepository : Repository<Stat>, IStatRepository
{
    public StatRepository(PokemonDbContext context) : base(context)
    {
    }

    public async Task<Stat?> GetByNameAsync(string name)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.Name.ToLower() == name.ToLower());
    }
}
