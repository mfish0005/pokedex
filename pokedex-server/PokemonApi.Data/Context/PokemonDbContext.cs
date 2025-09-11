using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Entities;

namespace PokemonApi.Data.Context;

public class PokemonDbContext : DbContext
{
    public PokemonDbContext(DbContextOptions<PokemonDbContext> options) : base(options)
    {
    }

    public DbSet<Pokemon> Pokemon { get; set; }
    public DbSet<Entities.Type> Types { get; set; }
    public DbSet<PokemonType> PokemonTypes { get; set; }
    public DbSet<Stat> Stats { get; set; }
    public DbSet<PokemonStat> PokemonStats { get; set; }
    public DbSet<Ability> Abilities { get; set; }
    public DbSet<PokemonAbility> PokemonAbilities { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Pokemon>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Name).IsUnique();
        });
        
        modelBuilder.Entity<Entities.Type>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Name).IsUnique();
        });
        
        modelBuilder.Entity<PokemonType>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Pokemon)
                .WithMany(e => e.PokemonTypes)
                .HasForeignKey(e => e.PokemonId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Type)
                .WithMany(e => e.PokemonTypes)
                .HasForeignKey(e => e.TypeId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.PokemonId, e.TypeId }).IsUnique();
        });
        
        modelBuilder.Entity<Stat>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Name).IsUnique();
        });
        
        modelBuilder.Entity<PokemonStat>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Pokemon)
                .WithMany(e => e.PokemonStats)
                .HasForeignKey(e => e.PokemonId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Stat)
                .WithMany(e => e.PokemonStats)
                .HasForeignKey(e => e.StatId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.PokemonId, e.StatId }).IsUnique();
        });

        modelBuilder.Entity<Ability>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        modelBuilder.Entity<PokemonAbility>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Pokemon)
                .WithMany(e => e.PokemonAbilities)
                .HasForeignKey(e => e.PokemonId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Ability)
                .WithMany(e => e.PokemonAbilities)
                .HasForeignKey(e => e.AbilityId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Entities.Type>().HasData(
            new Entities.Type { Id = 1, Name = "normal", Color = "#A8A878" },
            new Entities.Type { Id = 2, Name = "fire", Color = "#F08030" },
            new Entities.Type { Id = 3, Name = "water", Color = "#6890F0" },
            new Entities.Type { Id = 4, Name = "electric", Color = "#F8D030" },
            new Entities.Type { Id = 5, Name = "grass", Color = "#78C850" },
            new Entities.Type { Id = 6, Name = "ice", Color = "#98D8D8" },
            new Entities.Type { Id = 7, Name = "fighting", Color = "#C03028" },
            new Entities.Type { Id = 8, Name = "poison", Color = "#A040A0" },
            new Entities.Type { Id = 9, Name = "ground", Color = "#E0C068" },
            new Entities.Type { Id = 10, Name = "flying", Color = "#A890F0" },
            new Entities.Type { Id = 11, Name = "psychic", Color = "#F85888" },
            new Entities.Type { Id = 12, Name = "bug", Color = "#A8B820" },
            new Entities.Type { Id = 13, Name = "rock", Color = "#B8A038" },
            new Entities.Type { Id = 14, Name = "ghost", Color = "#705898" },
            new Entities.Type { Id = 15, Name = "dragon", Color = "#7038F8" },
            new Entities.Type { Id = 16, Name = "dark", Color = "#705848" },
            new Entities.Type { Id = 17, Name = "steel", Color = "#B8B8D0" },
            new Entities.Type { Id = 18, Name = "fairy", Color = "#EE99AC" }
        );

        modelBuilder.Entity<Stat>().HasData(
            new Stat { Id = 1, Name = "hp", DisplayName = "HP" },
            new Stat { Id = 2, Name = "attack", DisplayName = "Attack" },
            new Stat { Id = 3, Name = "defense", DisplayName = "Defense" },
            new Stat { Id = 4, Name = "special-attack", DisplayName = "Sp. Attack" },
            new Stat { Id = 5, Name = "special-defense", DisplayName = "Sp. Defense" },
            new Stat { Id = 6, Name = "speed", DisplayName = "Speed" }
        );
    }
}
