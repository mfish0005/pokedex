using PokemonApi.Services.DTOs;

namespace PokemonApi.Services.Interfaces;

public interface IPokemonService
{
    Task<PokemonListDto> GetListAsync(int page, int pageSize, string? search, CancellationToken cancellationToken = default);
    Task<PokemonDto?> GetAsync(int id, CancellationToken cancellationToken = default);
    Task<PokemonDto?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<List<PokemonSummaryDto>> SearchAsync(string term, CancellationToken cancellationToken = default);
    Task<bool> IsNameTakenAsync(string name, int? excludingId, CancellationToken cancellationToken = default);
    Task<PokemonDto> CreateAsync(PokemonInput input, CancellationToken cancellationToken = default);
    Task<PokemonDto?> UpdateAsync(int id, PokemonInput input, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
