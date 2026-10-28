using Microsoft.AspNetCore.Mvc;
using PokemonApi.Services.Validation;

namespace PokemonApi.Api.Infrastructure;

public static class ValidationProblemFactory
{
    public static ObjectResult CreateResult(IReadOnlyList<FieldError> errors, string title, int status = StatusCodes.Status400BadRequest)
    {
        var errorsByField = errors
            .GroupBy(error => error.Field)
            .ToDictionary(group => group.Key, group => group.Select(error => error.Message).ToArray());

        var problem = new ValidationProblemDetails(errorsByField)
        {
            Status = status,
            Title = title,
            Detail = string.Join(" ", errors.Select(error => error.Message))
        };

        var result = new ObjectResult(problem) { StatusCode = status };
        result.ContentTypes.Add("application/problem+json");

        return result;
    }
}
