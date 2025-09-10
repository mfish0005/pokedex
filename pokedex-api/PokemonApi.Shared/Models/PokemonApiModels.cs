namespace PokemonApi.Shared.Models;
public class PokemonApiResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Height { get; set; }
    public int Weight { get; set; }
    public int Base_Experience { get; set; }
    public int Order { get; set; }
    public PokemonApiSprites Sprites { get; set; } = new();
    public List<PokemonApiType> Types { get; set; } = new();
    public List<PokemonApiStat> Stats { get; set; } = new();
    public List<PokemonApiAbility> Abilities { get; set; } = new();
}

public class PokemonApiSprites
{
    public string? Front_Default { get; set; }
    public string? Front_Shiny { get; set; }
    public PokemonApiOtherSprites? Other { get; set; }
}

public class PokemonApiOtherSprites
{
    public PokemonApiOfficialArtwork? Official_Artwork { get; set; }
}

public class PokemonApiOfficialArtwork
{
    public string? Front_Default { get; set; }
    public string? Front_Shiny { get; set; }
}

public class PokemonApiType
{
    public int Slot { get; set; }
    public PokemonApiTypeDetail Type { get; set; } = new();
}

public class PokemonApiTypeDetail
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class PokemonApiStat
{
    public int Base_Stat { get; set; }
    public int Effort { get; set; }
    public PokemonApiStatDetail Stat { get; set; } = new();
}

public class PokemonApiStatDetail
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class PokemonApiAbility
{
    public bool Is_Hidden { get; set; }
    public int Slot { get; set; }
    public PokemonApiAbilityDetail Ability { get; set; } = new();
}

public class PokemonApiAbilityDetail
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class PokemonListResponse
{
    public int Count { get; set; }
    public string? Next { get; set; }
    public string? Previous { get; set; }
    public List<PokemonListItem> Results { get; set; } = new();
}

public class PokemonListItem
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}
