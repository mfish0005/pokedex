using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using PokemonApi.Api.Infrastructure;
using PokemonApi.Data.Context;
using PokemonApi.Data.Seed;
using PokemonApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Pokemon API",
        Version = "v1",
        Description = "A comprehensive RESTful API for managing Pokemon data with full CRUD operations",
        Contact = new OpenApiContact
        {
            Name = "Pokemon API Team",
            Email = "contact@pokemonapi.com",
            Url = new Uri("https://github.com/youruser/pokemon-api")
        },
        License = new OpenApiLicense
        {
            Name = "MIT License",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });
    
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
});

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddDbContext<PokemonDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddPokemonServices();
builder.Services.AddHttpClient<PokemonDataSeeder>();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Pokemon API V1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "Pokemon API Documentation";
        c.DisplayRequestDuration();
        c.EnableDeepLinking();
        c.EnableFilter();
        c.ShowExtensions();
        c.EnableValidator();
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

var commandLineArgs = Environment.GetCommandLineArgs();
if (commandLineArgs.Contains("--seed"))
{
    await SeedDatabaseAsync(app.Services);
    return;
}

app.Run();

static async Task SeedDatabaseAsync(IServiceProvider services)
{
    using var scope = services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<PokemonDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Ensuring database is created...");
        await context.Database.EnsureCreatedAsync();
        
        var httpClient = scope.ServiceProvider.GetRequiredService<HttpClient>();
        var seederLogger = scope.ServiceProvider.GetRequiredService<ILogger<PokemonDataSeeder>>();
        var seeder = new PokemonDataSeeder(context, httpClient, seederLogger);
        
        logger.LogInformation("Starting Pokemon data seeding...");
        await seeder.SeedPokemonDataAsync(151);
        
        logger.LogInformation("Database seeding completed!");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while seeding the database");
        throw;
    }
}