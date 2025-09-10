using System.ComponentModel.DataAnnotations;

namespace PokemonApi.Data.Entities;

public class PokemonStat
{
    public int Id { get; set; }
    
    public int PokemonId { get; set; }
    
    public int StatId { get; set; }
    
    public int BaseStat { get; set; }
    
    public int Effort { get; set; }        

    public virtual Pokemon Pokemon { get; set; } = null!;

    public virtual Stat Stat { get; set; } = null!;
}

public class Stat
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string? DisplayName { get; set; }
    
    public virtual ICollection<PokemonStat> PokemonStats { get; set; } = new List<PokemonStat>();
}
