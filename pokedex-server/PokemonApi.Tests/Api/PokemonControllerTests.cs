using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using PokemonApi.Api.Controllers;
using PokemonApi.Services.DTOs;
using PokemonApi.Services.Interfaces;

namespace PokemonApi.Tests.Api;

public class PokemonControllerTests
{
    private readonly Mock<IPokemonService> _pokemonService = new();
    private readonly PokemonController _controller;

    public PokemonControllerTests()
    {
        _controller = new PokemonController(
            _pokemonService.Object,
            Mock.Of<ILogger<PokemonController>>());

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
    }

    [Fact]
    public async Task GetPokemonById_ReturnsOk_WhenPokemonExists()
    {
        var dto = new PokemonDto { Id = 1, Name = "bulbasaur" };
        _pokemonService.Setup(s => s.GetPokemonByIdAsync(1)).ReturnsAsync(dto);

        var result = await _controller.GetPokemonById(1);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(dto, ok.Value);
    }

    [Fact]
    public async Task GetPokemonById_ReturnsNotFound_WhenPokemonMissing()
    {
        _pokemonService.Setup(s => s.GetPokemonByIdAsync(99)).ReturnsAsync((PokemonDto?)null);

        var result = await _controller.GetPokemonById(99);

        Assert.IsType<NotFoundObjectResult>(result);
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
        _pokemonService.Setup(s => s.GetPokemonListAsync(1, 20, null)).ReturnsAsync(list);

        var result = await _controller.GetPokemonList();

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(list, ok.Value);
    }

    [Fact]
    public async Task GetPokemonList_ClampsInvalidPageSize_BeforeCallingService()
    {
        var list = new PokemonListDto { Page = 1, PageSize = 20 };
        _pokemonService.Setup(s => s.GetPokemonListAsync(1, 20, null)).ReturnsAsync(list);

        await _controller.GetPokemonList(page: 1, pageSize: 500);

        _pokemonService.Verify(s => s.GetPokemonListAsync(1, 20, null), Times.Once);
    }

    [Fact]
    public async Task SearchPokemon_ReturnsBadRequest_WhenSearchIsEmpty()
    {
        var result = await _controller.SearchPokemon("   ");

        Assert.IsType<BadRequestObjectResult>(result);
        _pokemonService.Verify(s => s.SearchPokemonAsync(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task SearchPokemon_ReturnsOk_WithResults()
    {
        var results = new List<PokemonSummaryDto> { new() { Id = 1, Name = "bulba" } };
        _pokemonService.Setup(s => s.SearchPokemonAsync("bulba")).ReturnsAsync(results);

        var result = await _controller.SearchPokemon("bulba");

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(results, ok.Value);
    }

    [Fact]
    public async Task CreatePokemon_ReturnsCreated_WhenModelIsValid()
    {
        var createDto = new CreatePokemonDto { Name = "mewtwo", Height = 20, Weight = 1220, BaseExperience = 306 };
        var created = new PokemonDto { Id = 152, Name = "mewtwo" };
        _pokemonService.Setup(s => s.CreatePokemonAsync(createDto)).ReturnsAsync(created);

        var result = await _controller.CreatePokemon(createDto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(PokemonController.GetPokemonById), createdResult.ActionName);
        Assert.Equal(152, createdResult.RouteValues?["id"]);
        Assert.Equal(created, createdResult.Value);
    }

    [Fact]
    public async Task CreatePokemon_ReturnsBadRequest_WhenModelStateIsInvalid()
    {
        _controller.ModelState.AddModelError("Name", "Required");

        var result = await _controller.CreatePokemon(new CreatePokemonDto());

        Assert.IsType<BadRequestObjectResult>(result);
        _pokemonService.Verify(s => s.CreatePokemonAsync(It.IsAny<CreatePokemonDto>()), Times.Never);
    }

    [Fact]
    public async Task UpdatePokemon_ReturnsNotFound_WhenPokemonMissing()
    {
        var updateDto = new UpdatePokemonDto { Name = "updated" };
        _pokemonService.Setup(s => s.UpdatePokemonAsync(99, updateDto)).ReturnsAsync((PokemonDto?)null);

        var result = await _controller.UpdatePokemon(99, updateDto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UpdatePokemon_ReturnsOk_WhenPokemonExists()
    {
        var updateDto = new UpdatePokemonDto { Name = "venusaur" };
        var updated = new PokemonDto { Id = 3, Name = "venusaur" };
        _pokemonService.Setup(s => s.UpdatePokemonAsync(3, updateDto)).ReturnsAsync(updated);

        var result = await _controller.UpdatePokemon(3, updateDto);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(updated, ok.Value);
    }

    [Fact]
    public async Task DeletePokemon_ReturnsNoContent_WhenDeleted()
    {
        _pokemonService.Setup(s => s.DeletePokemonAsync(1)).ReturnsAsync(true);

        var result = await _controller.DeletePokemon(1);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeletePokemon_ReturnsNotFound_WhenPokemonMissing()
    {
        _pokemonService.Setup(s => s.DeletePokemonAsync(99)).ReturnsAsync(false);

        var result = await _controller.DeletePokemon(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }
}
