using PokemonApi.Data.Entities;

namespace PokemonApi.Data.Repositories.Interfaces;

public interface ITypeRepository : IRepository<PokemonApi.Data.Entities.Type>
{
    Task<PokemonApi.Data.Entities.Type?> GetByNameAsync(string name);
}
