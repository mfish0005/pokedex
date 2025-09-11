using System.ComponentModel.DataAnnotations;

namespace PokemonApi.Data.Entities;

public class PokemonAbility
{
    public int Id { get; set; }
    
    public int PokemonId { get; set; }
    
    public int AbilityId { get; set; }
    
    public bool IsHidden { get; set; }
    
    public int Slot { get; set; }  
    
    public virtual Pokemon Pokemon { get; set; } = null!;

    public virtual Ability Ability { get; set; } = null!;
}

public class Ability
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
        
    public virtual ICollection<PokemonAbility> PokemonAbilities { get; set; } = new List<PokemonAbility>();
}
