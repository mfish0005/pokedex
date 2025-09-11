using System.ComponentModel.DataAnnotations;

namespace PokemonApi.Data.Entities;

public class PokemonType
{
    public int Id { get; set; }
    
    public int PokemonId { get; set; }
    
    public int TypeId { get; set; }
    
    public int Slot { get; set; }    

    public virtual Pokemon Pokemon { get; set; } = null!;

    public virtual Type Type { get; set; } = null!;
}

public class Type
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(7)]
    public string? Color { get; set; }
    
    public virtual ICollection<PokemonType> PokemonTypes { get; set; } = new List<PokemonType>();
}
