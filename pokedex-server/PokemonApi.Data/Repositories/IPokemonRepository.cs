using PokemonApi.Data.Entities;

namespace PokemonApi.Data.Repositories;

public interface IPokemonRepository
{
    Task<PokemonPage> ListAsync(int page, int pageSize, string? search, CancellationToken cancellationToken = default);
    Task<Pokemon?> GetAsync(int id, CancellationToken cancellationToken = default);
    Task<Pokemon?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Pokemon>> SearchAsync(string term, int limit, CancellationToken cancellationToken = default);
    Task<bool> NameExistsAsync(string name, int? excludingId, CancellationToken cancellationToken = default);
    Task<int> NextIdAsync(CancellationToken cancellationToken = default);
    Task<Entities.Type?> FindTypeAsync(string name, CancellationToken cancellationToken = default);
    Task<Stat?> FindStatAsync(string name, CancellationToken cancellationToken = default);
    Task<Ability?> FindAbilityAsync(string name, CancellationToken cancellationToken = default);
    Task AddAsync(Pokemon pokemon, CancellationToken cancellationToken = default);
    Task UpdateAsync(Pokemon pokemon, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

public record PokemonPage(IReadOnlyList<Pokemon> Items, int TotalCount);
