using PokemonApi.Data.Entities;

namespace PokemonApi.Data.Repositories.Interfaces;

public interface IStatRepository : IRepository<Stat>
{
    Task<Stat?> GetByNameAsync(string name);
}
