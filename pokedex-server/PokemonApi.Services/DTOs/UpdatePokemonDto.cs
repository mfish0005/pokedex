using System.ComponentModel.DataAnnotations;

namespace PokemonApi.Services.DTOs;

public class UpdatePokemonDto
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

    public List<UpdatePokemonTypeDto> Types { get; set; } = new();
    public List<UpdatePokemonStatDto> Stats { get; set; } = new();
    public List<UpdatePokemonAbilityDto> Abilities { get; set; } = new();
}

public class UpdatePokemonTypeDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(7)] // For hex color codes
    public string Color { get; set; } = string.Empty;
}

public class UpdatePokemonStatDto
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

public class UpdatePokemonAbilityDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public bool IsHidden { get; set; }
}
