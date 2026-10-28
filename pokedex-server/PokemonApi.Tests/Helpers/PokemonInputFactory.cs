using PokemonApi.Services.DTOs;

namespace PokemonApi.Tests.Helpers;

public static class PokemonInputFactory
{
    public static PokemonInput Valid(string name = "mewtwo", string typeName = "psychic", string typeColor = "#F85888") => new()
    {
        Name = name,
        Height = 20,
        Weight = 1220,
        BaseExperience = 306,
        ImageUrl = "https://example.com/mewtwo.png",
        Types = [new PokemonTypeInput { Name = typeName, Color = typeColor }],
        Stats = [new PokemonStatInput { Name = "hp", DisplayName = "HP", BaseStat = 106 }],
        Abilities = [new PokemonAbilityInput { Name = "pressure", IsHidden = false }]
    };
}
