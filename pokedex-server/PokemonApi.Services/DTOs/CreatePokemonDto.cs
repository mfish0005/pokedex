using System.ComponentModel.DataAnnotations;

namespace PokemonApi.Services.DTOs;

public class CreatePokemonDto
{
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = string.Empty;

    [Range(1, 1000)]
    public int Height { get; set; }

    [Range(1, 10000)]
    public int Weight { get; set; }

    [Range(1, 1000)]
    public int BaseExperience { get; set; }

    [Url]
    public string? ImageUrl { get; set; }

    public List<CreatePokemonTypeDto> Types { get; set; } = new();
    public List<CreatePokemonStatDto> Stats { get; set; } = new();
    public List<CreatePokemonAbilityDto> Abilities { get; set; } = new();
}

public class CreatePokemonTypeDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(7)]
    public string Color { get; set; } = string.Empty;
}

public class CreatePokemonStatDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string DisplayName { get; set; } = string.Empty;

    [Range(0, 255)]
    public int BaseStat { get; set; }
}

public class CreatePokemonAbilityDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public bool IsHidden { get; set; }
}
