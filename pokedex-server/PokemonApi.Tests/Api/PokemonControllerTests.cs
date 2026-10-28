using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using PokemonApi.Api.Controllers;
using PokemonApi.Services.DTOs;
using PokemonApi.Services.Interfaces;
using PokemonApi.Tests.Helpers;

namespace PokemonApi.Tests.Api;

public class PokemonControllerTests
{
    private readonly Mock<IPokemonService> _pokemonService = new();
    private readonly PokemonController _controller;

    public PokemonControllerTests()
    {
        _controller = new PokemonController(_pokemonService.Object)
        {
            ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() }
        };
    }

    [Fact]
    public async Task GetPokemonById_ReturnsOk_WhenPokemonExists()
    {
        var dto = new PokemonDto { Id = 1, Name = "bulbasaur" };
        _pokemonService.Setup(s => s.GetAsync(1, It.IsAny<CancellationToken>())).ReturnsAsync(dto);

        var result = await _controller.GetPokemonById(1, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(dto, ok.Value);
    }

    [Fact]
    public async Task GetPokemonById_ReturnsNotFoundProblem_WhenPokemonMissing()
    {
        _pokemonService.Setup(s => s.GetAsync(99, It.IsAny<CancellationToken>())).ReturnsAsync((PokemonDto?)null);

        var result = await _controller.GetPokemonById(99, CancellationToken.None);

        var notFound = Assert.IsType<NotFoundObjectResult>(result);
        var problem = Assert.IsType<ProblemDetails>(notFound.Value);
        Assert.Equal(StatusCodes.Status404NotFound, problem.Status);
    }

    [Fact]
    public async Task GetPokemonList_ReturnsOk_WithPagedResult()
    {
        var list = new PokemonListDto
        {
            Count = 1,
            Page = 1,
            PageSize = 20,
            TotalPages = 1,
            Results = [new PokemonSummaryDto { Id = 1, Name = "bulbasaur" }]
        };
        _pokemonService.Setup(s => s.GetListAsync(1, 20, null, It.IsAny<CancellationToken>())).ReturnsAsync(list);

        var result = await _controller.GetPokemonList();

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(list, ok.Value);
    }

    [Theory]
    [InlineData(0, 20, "page")]
    [InlineData(1, 0, "pageSize")]
    [InlineData(1, 101, "pageSize")]
    public async Task GetPokemonList_ReturnsValidationProblem_WhenPagingIsInvalid(int page, int pageSize, string field)
    {
        var result = await _controller.GetPokemonList(page, pageSize);

        var problem = AssertValidationProblem(result, StatusCodes.Status400BadRequest);
        Assert.Contains(field, problem.Errors.Keys);
        _pokemonService.Verify(s => s.GetListAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string?>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task SearchPokemon_ReturnsValidationProblem_WhenSearchIsEmpty()
    {
        var result = await _controller.SearchPokemon("   ", CancellationToken.None);

        var problem = AssertValidationProblem(result, StatusCodes.Status400BadRequest);
        Assert.Contains("search", problem.Errors.Keys);
        _pokemonService.Verify(s => s.SearchAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task SearchPokemon_ReturnsOk_WithResults()
    {
        var results = new List<PokemonSummaryDto> { new() { Id = 1, Name = "bulba" } };
        _pokemonService.Setup(s => s.SearchAsync("bulba", It.IsAny<CancellationToken>())).ReturnsAsync(results);

        var result = await _controller.SearchPokemon("bulba", CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(results, ok.Value);
    }

    [Fact]
    public async Task CreatePokemon_ReturnsCreated_WhenInputIsValid()
    {
        var input = PokemonInputFactory.Valid();
        var created = new PokemonDto { Id = 152, Name = "mewtwo" };
        _pokemonService.Setup(s => s.CreateAsync(input, It.IsAny<CancellationToken>())).ReturnsAsync(created);

        var result = await _controller.CreatePokemon(input, CancellationToken.None);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(PokemonController.GetPokemonById), createdResult.ActionName);
        Assert.Equal(152, createdResult.RouteValues?["id"]);
        Assert.Equal(created, createdResult.Value);
    }

    [Fact]
    public async Task CreatePokemon_ReportsEveryInvalidField_WithoutCallingTheService()
    {
        var result = await _controller.CreatePokemon(new PokemonInput(), CancellationToken.None);

        var problem = AssertValidationProblem(result, StatusCodes.Status400BadRequest);
        Assert.Equal(["name", "height", "weight", "baseExperience", "types"], problem.Errors.Keys);
        _pokemonService.Verify(s => s.CreateAsync(It.IsAny<PokemonInput>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task CreatePokemon_ReturnsConflict_WhenNameIsTaken()
    {
        var input = PokemonInputFactory.Valid("pikachu");
        _pokemonService.Setup(s => s.IsNameTakenAsync("pikachu", null, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        var result = await _controller.CreatePokemon(input, CancellationToken.None);

        var problem = AssertValidationProblem(result, StatusCodes.Status409Conflict);
        Assert.Contains("name", problem.Errors.Keys);
        _pokemonService.Verify(s => s.CreateAsync(It.IsAny<PokemonInput>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task UpdatePokemon_ReturnsNotFoundProblem_WhenPokemonMissing()
    {
        var input = PokemonInputFactory.Valid();
        _pokemonService.Setup(s => s.UpdateAsync(99, input, It.IsAny<CancellationToken>())).ReturnsAsync((PokemonDto?)null);

        var result = await _controller.UpdatePokemon(99, input, CancellationToken.None);

        var notFound = Assert.IsType<NotFoundObjectResult>(result);
        Assert.IsType<ProblemDetails>(notFound.Value);
    }

    [Fact]
    public async Task UpdatePokemon_ReturnsOk_WhenPokemonExists()
    {
        var input = PokemonInputFactory.Valid("venusaur");
        var updated = new PokemonDto { Id = 3, Name = "venusaur" };
        _pokemonService.Setup(s => s.UpdateAsync(3, input, It.IsAny<CancellationToken>())).ReturnsAsync(updated);

        var result = await _controller.UpdatePokemon(3, input, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(updated, ok.Value);
    }

    [Fact]
    public async Task UpdatePokemon_ChecksTheNameAgainstOtherPokemonOnly()
    {
        var input = PokemonInputFactory.Valid("venusaur");
        _pokemonService.Setup(s => s.IsNameTakenAsync("venusaur", 3, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        var result = await _controller.UpdatePokemon(3, input, CancellationToken.None);

        AssertValidationProblem(result, StatusCodes.Status409Conflict);
        _pokemonService.Verify(s => s.UpdateAsync(It.IsAny<int>(), It.IsAny<PokemonInput>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task DeletePokemon_ReturnsNoContent_WhenDeleted()
    {
        _pokemonService.Setup(s => s.DeleteAsync(1, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        var result = await _controller.DeletePokemon(1, CancellationToken.None);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeletePokemon_ReturnsNotFoundProblem_WhenPokemonMissing()
    {
        _pokemonService.Setup(s => s.DeleteAsync(99, It.IsAny<CancellationToken>())).ReturnsAsync(false);

        var result = await _controller.DeletePokemon(99, CancellationToken.None);

        var notFound = Assert.IsType<NotFoundObjectResult>(result);
        Assert.IsType<ProblemDetails>(notFound.Value);
    }

    private static ValidationProblemDetails AssertValidationProblem(IActionResult result, int status)
    {
        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(status, objectResult.StatusCode);
        Assert.Contains("application/problem+json", objectResult.ContentTypes);

        return Assert.IsType<ValidationProblemDetails>(objectResult.Value);
    }
}
