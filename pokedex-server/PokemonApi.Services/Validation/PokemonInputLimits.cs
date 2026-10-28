namespace PokemonApi.Services.Validation;

public static class PokemonInputLimits
{
    public const int NameMaxLength = 100;
    public const int ImageUrlMaxLength = 500;
    public const int MaxHeight = 1000;
    public const int MaxWeight = 10000;
    public const int MaxBaseExperience = 1000;
    public const int MaxTypes = 2;
    public const int TypeNameMaxLength = 50;
    public const int StatNameMaxLength = 50;
    public const int StatDisplayNameMaxLength = 50;
    public const int MaxBaseStat = 255;
    public const int AbilityNameMaxLength = 100;
    public const int MaxPageSize = 100;
}
