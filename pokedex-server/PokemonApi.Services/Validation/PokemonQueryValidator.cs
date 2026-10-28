namespace PokemonApi.Services.Validation;

public static class PokemonQueryValidator
{
    public static IReadOnlyList<FieldError> ValidateList(int page, int pageSize)
    {
        var errors = new List<FieldError>();

        if (page < 1)
        {
            errors.Add(new("page", "page must be 1 or greater."));
        }

        if (pageSize < 1 || pageSize > PokemonInputLimits.MaxPageSize)
        {
            errors.Add(new("pageSize", $"pageSize must be between 1 and {PokemonInputLimits.MaxPageSize}."));
        }

        return errors;
    }

    public static IReadOnlyList<FieldError> ValidateSearch(string? search) =>
        string.IsNullOrWhiteSpace(search) ? [new("search", "search is required.")] : [];
}
