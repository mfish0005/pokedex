using Microsoft.AspNetCore.Mvc;
using PokemonApi.Api.Infrastructure;
using PokemonApi.Services.DTOs;
using PokemonApi.Services.Interfaces;
using PokemonApi.Services.Validation;

namespace PokemonApi.Api.Controllers;

/// <summary>
/// Pokemon API Controller - Provides CRUD operations for Pokemon
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PokemonController(IPokemonService pokemonService) : ControllerBase
{
    private const string InvalidRequestTitle = "Invalid request";
    private const string InvalidPokemonTitle = "Invalid Pokemon";

    /// <summary>
    /// Retrieves a paginated list of Pokemon with optional search functionality
    /// </summary>
    /// <param name="page">Page number (default: 1, minimum: 1)</param>
    /// <param name="pageSize">Number of items per page (default: 20, range: 1-100)</param>
    /// <param name="search">Optional search term to filter Pokemon by name (case-insensitive)</param>
    /// <param name="cancellationToken">Cancelled when the client disconnects</param>
    /// <response code="200">Returns the paginated list of Pokemon</response>
    /// <response code="400">If the page or pageSize parameters are invalid</response>
    [HttpGet]
    [ProducesResponseType(typeof(PokemonListDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetPokemonList(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        var errors = PokemonQueryValidator.ValidateList(page, pageSize);

        if (errors.Count > 0)
        {
            return ValidationProblemFactory.CreateResult(errors, InvalidRequestTitle);
        }

        return Ok(await pokemonService.GetListAsync(page, pageSize, search, cancellationToken));
    }

    /// <summary>
    /// Get a Pokemon by ID
    /// </summary>
    /// <param name="id">Pokemon ID</param>
    /// <param name="cancellationToken">Cancelled when the client disconnects</param>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(PokemonDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPokemonById(int id, CancellationToken cancellationToken)
    {
        var pokemon = await pokemonService.GetAsync(id, cancellationToken);

        return pokemon is null ? PokemonNotFound($"No Pokemon exists with id {id}.") : Ok(pokemon);
    }

    /// <summary>
    /// Get a Pokemon by name
    /// </summary>
    /// <param name="name">Pokemon name</param>
    /// <param name="cancellationToken">Cancelled when the client disconnects</param>
    [HttpGet("name/{name}")]
    [ProducesResponseType(typeof(PokemonDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPokemonByName(string name, CancellationToken cancellationToken)
    {
        var pokemon = await pokemonService.GetByNameAsync(name, cancellationToken);

        return pokemon is null ? PokemonNotFound($"No Pokemon exists with the name {name}.") : Ok(pokemon);
    }

    /// <summary>
    /// Search for Pokemon by name
    /// </summary>
    /// <param name="search">Search term</param>
    /// <param name="cancellationToken">Cancelled when the client disconnects</param>
    [HttpGet("search")]
    [ProducesResponseType(typeof(List<PokemonSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SearchPokemon([FromQuery] string? search, CancellationToken cancellationToken)
    {
        var errors = PokemonQueryValidator.ValidateSearch(search);

        if (errors.Count > 0)
        {
            return ValidationProblemFactory.CreateResult(errors, InvalidRequestTitle);
        }

        return Ok(await pokemonService.SearchAsync(search!, cancellationToken));
    }

    /// <summary>
    /// Creates a new Pokemon
    /// </summary>
    /// <remarks>The next free Pokedex number is assigned as the id. Names are stored in lower case.</remarks>
    /// <param name="input">Pokemon details, including types, stats and abilities</param>
    /// <param name="cancellationToken">Cancelled when the client disconnects</param>
    /// <response code="201">Returns the newly created Pokemon</response>
    /// <response code="400">If any field is missing or invalid</response>
    /// <response code="409">If a Pokemon with the same name already exists</response>
    [HttpPost]
    [ProducesResponseType(typeof(PokemonDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreatePokemon([FromBody] PokemonInput input, CancellationToken cancellationToken)
    {
        var errors = PokemonInputValidator.Validate(input);

        if (errors.Count > 0)
        {
            return ValidationProblemFactory.CreateResult(errors, InvalidPokemonTitle);
        }

        if (await pokemonService.IsNameTakenAsync(input.Name!, excludingId: null, cancellationToken))
        {
            return NameTaken(input.Name!);
        }

        var created = await pokemonService.CreateAsync(input, cancellationToken);

        return CreatedAtAction(nameof(GetPokemonById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Replaces the details of an existing Pokemon
    /// </summary>
    /// <param name="id">Pokemon ID</param>
    /// <param name="input">Pokemon details, including types, stats and abilities</param>
    /// <param name="cancellationToken">Cancelled when the client disconnects</param>
    /// <response code="200">Returns the updated Pokemon</response>
    /// <response code="400">If any field is missing or invalid</response>
    /// <response code="404">If no Pokemon exists with the id</response>
    /// <response code="409">If another Pokemon already has the name</response>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(PokemonDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> UpdatePokemon(int id, [FromBody] PokemonInput input, CancellationToken cancellationToken)
    {
        var errors = PokemonInputValidator.Validate(input);

        if (errors.Count > 0)
        {
            return ValidationProblemFactory.CreateResult(errors, InvalidPokemonTitle);
        }

        if (await pokemonService.IsNameTakenAsync(input.Name!, excludingId: id, cancellationToken))
        {
            return NameTaken(input.Name!);
        }

        var updated = await pokemonService.UpdateAsync(id, input, cancellationToken);

        return updated is null ? PokemonNotFound($"No Pokemon exists with id {id}.") : Ok(updated);
    }

    /// <summary>
    /// Delete a Pokemon
    /// </summary>
    /// <param name="id">Pokemon ID</param>
    /// <param name="cancellationToken">Cancelled when the client disconnects</param>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletePokemon(int id, CancellationToken cancellationToken)
    {
        var deleted = await pokemonService.DeleteAsync(id, cancellationToken);

        return deleted ? NoContent() : PokemonNotFound($"No Pokemon exists with id {id}.");
    }

    private NotFoundObjectResult PokemonNotFound(string detail) => NotFound(new ProblemDetails
    {
        Status = StatusCodes.Status404NotFound,
        Title = "Pokemon not found",
        Detail = detail
    });

    private static ObjectResult NameTaken(string name) => ValidationProblemFactory.CreateResult(
        [new FieldError("name", $"A Pokemon named {name.Trim()} already exists.")],
        "Pokemon already exists",
        StatusCodes.Status409Conflict);
}
