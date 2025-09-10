using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Entities;

namespace PokemonApi.Data.Repositories.Interfaces;

public interface IPokemonRepository : IRepository<Pokemon>
{
    IQueryable<Pokemon> GetQueryable();
    Task<Pokemon?> GetPokemonWithDetailsAsync(int id);
    Task<IEnumerable<Pokemon>> GetPokemonWithDetailsAsync();
    Task<IEnumerable<Pokemon>> GetPokemonPagedWithDetailsAsync(int page, int pageSize);
    Task<IEnumerable<Pokemon>> SearchPokemonByNameAsync(string name);
    Task<Pokemon?> GetPokemonByNameAsync(string name);
    Task<Pokemon?> GetNextPokemonAsync(int currentId);
    Task<Pokemon?> GetPreviousPokemonAsync(int currentId);
}
