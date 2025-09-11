using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Context;
using PokemonApi.Data.Entities;
using PokemonApi.Data.Repositories.Interfaces;

namespace PokemonApi.Data.Repositories;

public class TypeRepository : Repository<PokemonApi.Data.Entities.Type>, ITypeRepository
{
    public TypeRepository(PokemonDbContext context) : base(context)
    {
    }

    public async Task<PokemonApi.Data.Entities.Type?> GetByNameAsync(string name)
    {
        return await _dbSet.FirstOrDefaultAsync(t => t.Name.ToLower() == name.ToLower());
    }
}
