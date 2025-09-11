using PokemonApi.Data.Entities;

namespace PokemonApi.Data.Repositories.Interfaces;

public interface IAbilityRepository : IRepository<Ability>
{
    Task<Ability?> GetByNameAsync(string name);
}
