using System.ComponentModel.DataAnnotations;

namespace PokemonApi.Data.Entities;

public class Pokemon
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    public int Height { get; set; }
    
    public int Weight { get; set; }
    
    public int BaseExperience { get; set; }
    
    public int Order { get; set; }
    
    [MaxLength(500)]
    public string? ImageUrl { get; set; }
    
    [MaxLength(500)]
    public string? ShinyImageUrl { get; set; }
        
    public virtual ICollection<PokemonType> PokemonTypes { get; set; } = new List<PokemonType>();
    public virtual ICollection<PokemonStat> PokemonStats { get; set; } = new List<PokemonStat>();
    public virtual ICollection<PokemonAbility> PokemonAbilities { get; set; } = new List<PokemonAbility>();
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
