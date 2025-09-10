using Microsoft.AspNetCore.Mvc;
using PokemonApi.Services.Interfaces;
using PokemonApi.Services.DTOs;

namespace PokemonApi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PokemonController : ControllerBase
{
    private readonly IPokemonService _pokemonService;
    private readonly ILogger<PokemonController> _logger;

    public PokemonController(IPokemonService pokemonService, ILogger<PokemonController> logger)
    {
        _pokemonService = pokemonService;
        _logger = logger;
    }

    /// <summary>
    /// Get a paginated list of Pokemon
    /// </summary>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Number of items per page (default: 20)</param>
    /// <param name="search">Optional search term to filter by name</param>
    /// <returns>Paginated list of Pokemon</returns>
    [HttpGet]
    public async Task<IActionResult> GetPokemonList(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20, 
        [FromQuery] string? search = null)
    {
        try
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 20;

            var result = await _pokemonService.GetPokemonListAsync(page, pageSize, search);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving Pokemon list");
            return StatusCode(500, "An error occurred while retrieving Pokemon data");
        }
    }

    /// <summary>
    /// Get a Pokemon by ID
    /// </summary>
    /// <param name="id">Pokemon ID</param>
    /// <returns>Pokemon details</returns>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetPokemonById(int id)
    {
        try
        {
            var pokemon = await _pokemonService.GetPokemonByIdAsync(id);
            
            if (pokemon == null)
            {
                return NotFound($"Pokemon with ID {id} not found");
            }

            return Ok(pokemon);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving Pokemon with ID {PokemonId}", id);
            return StatusCode(500, "An error occurred while retrieving Pokemon data");
        }
    }

    /// <summary>
    /// Get a Pokemon by name
    /// </summary>
    /// <param name="name">Pokemon name</param>
    /// <returns>Pokemon details</returns>
    [HttpGet("name/{name}")]
    public async Task<IActionResult> GetPokemonByName(string name)
    {
        try
        {
            var pokemon = await _pokemonService.GetPokemonByNameAsync(name);
            
            if (pokemon == null)
            {
                return NotFound($"Pokemon with name '{name}' not found");
            }

            return Ok(pokemon);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving Pokemon with name {PokemonName}", name);
            return StatusCode(500, "An error occurred while retrieving Pokemon data");
        }
    }

    /// <summary>
    /// Search for Pokemon by name
    /// </summary>
    /// <param name="search">Search term</param>
    /// <returns>List of matching Pokemon</returns>
    [HttpGet("search")]
    public async Task<IActionResult> SearchPokemon([FromQuery] string search)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(search))
            {
                return BadRequest("Search term is required");
            }

            var results = await _pokemonService.SearchPokemonAsync(search);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching Pokemon with term {SearchTerm}", search);
            return StatusCode(500, "An error occurred while searching Pokemon data");
        }
    }

    /// <summary>
    /// Create a new Pokemon
    /// </summary>
    /// <param name="createDto">Pokemon creation data</param>
    /// <returns>Created Pokemon</returns>
    [HttpPost]
    public async Task<IActionResult> CreatePokemon([FromBody] CreatePokemonDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdPokemon = await _pokemonService.CreatePokemonAsync(createDto);
            return CreatedAtAction(nameof(GetPokemonById), new { id = createdPokemon.Id }, createdPokemon);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Pokemon");
            return StatusCode(500, "An error occurred while creating Pokemon");
        }
    }

    /// <summary>
    /// Update an existing Pokemon
    /// </summary>
    /// <param name="id">Pokemon ID</param>
    /// <param name="updateDto">Pokemon update data</param>
    /// <returns>Updated Pokemon</returns>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdatePokemon(int id, [FromBody] UpdatePokemonDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedPokemon = await _pokemonService.UpdatePokemonAsync(id, updateDto);
            
            if (updatedPokemon == null)
            {
                return NotFound($"Pokemon with ID {id} not found");
            }

            return Ok(updatedPokemon);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating Pokemon with ID {PokemonId}", id);
            return StatusCode(500, "An error occurred while updating Pokemon");
        }
    }

    /// <summary>
    /// Delete a Pokemon
    /// </summary>
    /// <param name="id">Pokemon ID</param>
    /// <returns>Success or not found</returns>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletePokemon(int id)
    {
        try
        {
            var success = await _pokemonService.DeletePokemonAsync(id);
            
            if (!success)
            {
                return NotFound($"Pokemon with ID {id} not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting Pokemon with ID {PokemonId}", id);
            return StatusCode(500, "An error occurred while deleting Pokemon");
        }
    }
}
