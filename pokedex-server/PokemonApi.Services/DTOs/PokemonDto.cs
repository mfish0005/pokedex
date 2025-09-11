namespace PokemonApi.Services.DTOs;

public class PokemonDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Height { get; set; }
    public int Weight { get; set; }
    public int BaseExperience { get; set; }
    public int Order { get; set; }
    public string? ImageUrl { get; set; }
    public string? ShinyImageUrl { get; set; }
    public List<PokemonTypeDto> Types { get; set; } = new();
    public List<PokemonStatDto> Stats { get; set; } = new();
    public List<PokemonAbilityDto> Abilities { get; set; } = new();
}

public class PokemonTypeDto
{
    public int Slot { get; set; }
    public TypeDto Type { get; set; } = new();
}

public class TypeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

public class PokemonStatDto
{
    public int BaseStat { get; set; }
    public int Effort { get; set; }
    public StatDto Stat { get; set; } = new();
}

public class StatDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
}

public class PokemonAbilityDto
{
    public bool IsHidden { get; set; }
    public int Slot { get; set; }
    public AbilityDto Ability { get; set; } = new();
}

public class AbilityDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class PokemonListDto
{
    public int Count { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public List<PokemonSummaryDto> Results { get; set; } = new();
}

public class PokemonSummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public List<TypeDto> Types { get; set; } = new();
}
