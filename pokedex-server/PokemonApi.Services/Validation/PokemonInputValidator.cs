using System.Text.RegularExpressions;
using PokemonApi.Services.DTOs;

namespace PokemonApi.Services.Validation;

public static partial class PokemonInputValidator
{
    [GeneratedRegex(@"^#[0-9A-Fa-f]{6}$")]
    private static partial Regex HexColorPattern();

    public static IReadOnlyList<FieldError> Validate(PokemonInput input)
    {
        var errors = new List<FieldError>();

        ValidateText(errors, "name", "Name", input.Name, PokemonInputLimits.NameMaxLength);
        ValidateImageUrl(errors, input.ImageUrl);
        ValidateRange(errors, "height", "Height", input.Height, 1, PokemonInputLimits.MaxHeight);
        ValidateRange(errors, "weight", "Weight", input.Weight, 1, PokemonInputLimits.MaxWeight);
        ValidateRange(errors, "baseExperience", "Base experience", input.BaseExperience, 1, PokemonInputLimits.MaxBaseExperience);
        ValidateTypes(errors, input.Types ?? []);
        ValidateStats(errors, input.Stats ?? []);
        ValidateAbilities(errors, input.Abilities ?? []);

        return errors;
    }

    private static void ValidateTypes(List<FieldError> errors, IReadOnlyList<PokemonTypeInput> types)
    {
        if (types.Count == 0)
        {
            errors.Add(new("types", "Add at least one type."));
        }
        else if (types.Count > PokemonInputLimits.MaxTypes)
        {
            errors.Add(new("types", $"A Pokemon can have at most {PokemonInputLimits.MaxTypes} types."));
        }

        for (var i = 0; i < types.Count; i++)
        {
            ValidateText(errors, $"types[{i}].name", "Type", types[i].Name, PokemonInputLimits.TypeNameMaxLength);

            if (string.IsNullOrWhiteSpace(types[i].Color))
            {
                errors.Add(new($"types[{i}].color", "Color is required."));
            }
            else if (!HexColorPattern().IsMatch(types[i].Color!.Trim()))
            {
                errors.Add(new($"types[{i}].color", "Color must be a hex code such as #A8A878."));
            }
        }

        ValidateUnique(errors, "types", "type", types.Select(type => type.Name));
    }

    private static void ValidateStats(List<FieldError> errors, IReadOnlyList<PokemonStatInput> stats)
    {
        for (var i = 0; i < stats.Count; i++)
        {
            ValidateText(errors, $"stats[{i}].name", "Stat", stats[i].Name, PokemonInputLimits.StatNameMaxLength);
            ValidateText(errors, $"stats[{i}].displayName", "Display name", stats[i].DisplayName, PokemonInputLimits.StatDisplayNameMaxLength);
            ValidateRange(errors, $"stats[{i}].baseStat", "Base value", stats[i].BaseStat, 0, PokemonInputLimits.MaxBaseStat);
        }

        ValidateUnique(errors, "stats", "stat", stats.Select(stat => stat.Name));
    }

    private static void ValidateAbilities(List<FieldError> errors, IReadOnlyList<PokemonAbilityInput> abilities)
    {
        for (var i = 0; i < abilities.Count; i++)
        {
            ValidateText(errors, $"abilities[{i}].name", "Ability name", abilities[i].Name, PokemonInputLimits.AbilityNameMaxLength);
        }

        ValidateUnique(errors, "abilities", "ability", abilities.Select(ability => ability.Name));
    }

    private static void ValidateImageUrl(List<FieldError> errors, string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            return;
        }

        var trimmed = imageUrl.Trim();

        if (trimmed.Length > PokemonInputLimits.ImageUrlMaxLength)
        {
            errors.Add(new("imageUrl", $"Image URL must be {PokemonInputLimits.ImageUrlMaxLength} characters or fewer."));
        }
        else if (!Uri.TryCreate(trimmed, UriKind.Absolute, out var uri) || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
        {
            errors.Add(new("imageUrl", "Image URL must start with http:// or https://."));
        }
    }

    private static void ValidateText(List<FieldError> errors, string field, string label, string? value, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            errors.Add(new(field, $"{label} is required."));
        }
        else if (value.Trim().Length > maxLength)
        {
            errors.Add(new(field, $"{label} must be {maxLength} characters or fewer."));
        }
    }

    private static void ValidateRange(List<FieldError> errors, string field, string label, int? value, int min, int max)
    {
        if (value is not { } number)
        {
            errors.Add(new(field, $"{label} is required."));
        }
        else if (number < min || number > max)
        {
            errors.Add(new(field, $"{label} must be between {min} and {max}."));
        }
    }

    private static void ValidateUnique(List<FieldError> errors, string field, string noun, IEnumerable<string?> names)
    {
        var hasDuplicates = names
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .GroupBy(name => name!.Trim().ToLowerInvariant())
            .Any(group => group.Count() > 1);

        if (hasDuplicates)
        {
            errors.Add(new(field, $"Each {noun} can only be added once."));
        }
    }
}
