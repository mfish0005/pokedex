namespace PokemonApi.Services.DTOs;

public record PokemonInput
{
    public string? Name { get; init; }
    public int? Height { get; init; }
    public int? Weight { get; init; }
    public int? BaseExperience { get; init; }
    public string? ImageUrl { get; init; }
    public IReadOnlyList<PokemonTypeInput>? Types { get; init; }
    public IReadOnlyList<PokemonStatInput>? Stats { get; init; }
    public IReadOnlyList<PokemonAbilityInput>? Abilities { get; init; }
}

public record PokemonTypeInput
{
    public string? Name { get; init; }
    public string? Color { get; init; }
}

public record PokemonStatInput
{
    public string? Name { get; init; }
    public string? DisplayName { get; init; }
    public int? BaseStat { get; init; }
}

public record PokemonAbilityInput
{
    public string? Name { get; init; }
    public bool IsHidden { get; init; }
}
