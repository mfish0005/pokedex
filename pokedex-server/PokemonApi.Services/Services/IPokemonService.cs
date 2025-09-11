using PokemonApi.Services.DTOs;

namespace PokemonApi.Services.Interfaces;

public interface IPokemonService
{
    Task<PokemonListDto> GetPokemonListAsync(int page = 1, int pageSize = 20, string? search = null);
    Task<PokemonDto?> GetPokemonByIdAsync(int id);
    Task<PokemonDto?> GetPokemonByNameAsync(string name);
    Task<List<PokemonSummaryDto>> SearchPokemonAsync(string searchTerm);
    Task<PokemonDto> CreatePokemonAsync(CreatePokemonDto createDto);
    Task<PokemonDto?> UpdatePokemonAsync(int id, UpdatePokemonDto updateDto);
    Task<bool> DeletePokemonAsync(int id);
}
