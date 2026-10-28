using PokemonApi.Services.DTOs;
using PokemonApi.Services.Validation;
using PokemonApi.Tests.Helpers;

namespace PokemonApi.Tests.Validation;

public class PokemonInputValidatorTests
{
    [Fact]
    public void Validate_ReturnsNoErrors_ForValidInput()
    {
        Assert.Empty(PokemonInputValidator.Validate(PokemonInputFactory.Valid()));
    }

    [Fact]
    public void Validate_ReportsMissingFieldsAsRequired()
    {
        var errors = PokemonInputValidator.Validate(new PokemonInput());

        Assert.Contains(new FieldError("name", "Name is required."), errors);
        Assert.Contains(new FieldError("height", "Height is required."), errors);
        Assert.Contains(new FieldError("baseExperience", "Base experience is required."), errors);
        Assert.Contains(new FieldError("types", "Add at least one type."), errors);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1001)]
    public void Validate_RejectsHeightOutsideRange(int height)
    {
        var errors = PokemonInputValidator.Validate(PokemonInputFactory.Valid() with { Height = height });

        Assert.Equal(new FieldError("height", "Height must be between 1 and 1000."), Assert.Single(errors));
    }

    [Theory]
    [InlineData("javascript:alert(1)")]
    [InlineData("ftp://example.com/a.png")]
    [InlineData("not a url")]
    public void Validate_OnlyAllowsHttpImageUrls(string imageUrl)
    {
        var errors = PokemonInputValidator.Validate(PokemonInputFactory.Valid() with { ImageUrl = imageUrl });

        Assert.Equal("imageUrl", Assert.Single(errors).Field);
    }

    [Fact]
    public void Validate_AllowsBlankImageUrl()
    {
        Assert.Empty(PokemonInputValidator.Validate(PokemonInputFactory.Valid() with { ImageUrl = " " }));
    }

    [Fact]
    public void Validate_ReportsNestedFieldsByIndex()
    {
        var input = PokemonInputFactory.Valid() with
        {
            Types = [new PokemonTypeInput { Name = "fire", Color = "orange" }],
            Stats = [new PokemonStatInput { Name = "hp", DisplayName = "HP", BaseStat = 300 }],
            Abilities = [new PokemonAbilityInput { Name = " " }]
        };

        var fields = PokemonInputValidator.Validate(input).Select(error => error.Field);

        Assert.Equal(["types[0].color", "stats[0].baseStat", "abilities[0].name"], fields);
    }

    [Fact]
    public void Validate_RejectsMoreThanTwoTypes()
    {
        var input = PokemonInputFactory.Valid() with
        {
            Types =
            [
                new PokemonTypeInput { Name = "fire", Color = "#F08030" },
                new PokemonTypeInput { Name = "water", Color = "#6890F0" },
                new PokemonTypeInput { Name = "grass", Color = "#78C850" }
            ]
        };

        Assert.Equal("types", Assert.Single(PokemonInputValidator.Validate(input)).Field);
    }

    [Fact]
    public void Validate_RejectsDuplicatesIgnoringCase()
    {
        var input = PokemonInputFactory.Valid() with
        {
            Types =
            [
                new PokemonTypeInput { Name = "fire", Color = "#F08030" },
                new PokemonTypeInput { Name = " Fire", Color = "#F08030" }
            ],
            Stats =
            [
                new PokemonStatInput { Name = "hp", DisplayName = "HP", BaseStat = 1 },
                new PokemonStatInput { Name = "hp", DisplayName = "HP", BaseStat = 2 }
            ],
            Abilities =
            [
                new PokemonAbilityInput { Name = "blaze" },
                new PokemonAbilityInput { Name = "BLAZE" }
            ]
        };

        var fields = PokemonInputValidator.Validate(input).Select(error => error.Field);

        Assert.Equal(["types", "stats", "abilities"], fields);
    }
}
