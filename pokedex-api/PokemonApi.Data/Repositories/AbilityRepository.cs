using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Context;
using PokemonApi.Data.Entities;
using PokemonApi.Data.Repositories.Interfaces;

namespace PokemonApi.Data.Repositories;

public class AbilityRepository : Repository<Ability>, IAbilityRepository
{
    public AbilityRepository(PokemonDbContext context) : base(context)
    {
    }

    public async Task<Ability?> GetByNameAsync(string name)
    {
        return await _dbSet.FirstOrDefaultAsync(a => a.Name.ToLower() == name.ToLower());
    }
}
