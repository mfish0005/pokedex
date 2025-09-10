using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace PokemonApi.Data.Context;

public class PokemonDbContextFactory : IDesignTimeDbContextFactory<PokemonDbContext>
{
    public PokemonDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<PokemonDbContext>();
        optionsBuilder.UseSqlServer("Server=localhost,1433;Database=PokemonDb;User Id=sa;Password=Pokemon123!;TrustServerCertificate=true;");

        return new PokemonDbContext(optionsBuilder.Options);
    }
}
