using Microsoft.EntityFrameworkCore;
using PokemonApi.Data.Context;
using PokemonApi.Data.Entities;

namespace PokemonApi.Data.Repositories;

public class PokemonRepository(PokemonDbContext context) : IPokemonRepository
{
    public async Task<PokemonPage> ListAsync(int page, int pageSize, string? search, CancellationToken cancellationToken = default)
    {
        var query = context.Pokemon.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(term));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Include(p => p.PokemonTypes).ThenInclude(pt => pt.Type)
            .OrderBy(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PokemonPage(items, totalCount);
    }

    public Task<Pokemon?> GetAsync(int id, CancellationToken cancellationToken = default) =>
        WithDetails().FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    public Task<Pokemon?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        var normalized = name.Trim().ToLower();

        return WithDetails().AsNoTracking().FirstOrDefaultAsync(p => p.Name.ToLower() == normalized, cancellationToken);
    }

    public async Task<IReadOnlyList<Pokemon>> SearchAsync(string term, int limit, CancellationToken cancellationToken = default)
    {
        var normalized = term.Trim().ToLower();

        return await context.Pokemon
            .AsNoTracking()
            .Include(p => p.PokemonTypes).ThenInclude(pt => pt.Type)
            .Where(p => p.Name.ToLower().Contains(normalized))
            .OrderBy(p => p.Name)
            .Take(limit)
            .ToListAsync(cancellationToken);
    }

    public Task<bool> NameExistsAsync(string name, int? excludingId, CancellationToken cancellationToken = default)
    {
        var normalized = name.Trim().ToLower();

        return context.Pokemon.AnyAsync(p => p.Name.ToLower() == normalized && p.Id != excludingId, cancellationToken);
    }

    public async Task<int> NextIdAsync(CancellationToken cancellationToken = default) =>
        (await context.Pokemon.MaxAsync(p => (int?)p.Id, cancellationToken) ?? 0) + 1;

    public Task<Entities.Type?> FindTypeAsync(string name, CancellationToken cancellationToken = default) =>
        context.Types.FirstOrDefaultAsync(t => t.Name.ToLower() == name.ToLower(), cancellationToken);

    public Task<Stat?> FindStatAsync(string name, CancellationToken cancellationToken = default) =>
        context.Stats.FirstOrDefaultAsync(s => s.Name.ToLower() == name.ToLower(), cancellationToken);

    public Task<Ability?> FindAbilityAsync(string name, CancellationToken cancellationToken = default) =>
        context.Abilities.FirstOrDefaultAsync(a => a.Name.ToLower() == name.ToLower(), cancellationToken);

    public async Task AddAsync(Pokemon pokemon, CancellationToken cancellationToken = default)
    {
        context.Pokemon.Add(pokemon);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Pokemon pokemon, CancellationToken cancellationToken = default)
    {
        pokemon.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var pokemon = await context.Pokemon.FindAsync([id], cancellationToken);

        if (pokemon is null)
        {
            return false;
        }

        context.Pokemon.Remove(pokemon);
        await context.SaveChangesAsync(cancellationToken);

        return true;
    }

    private IQueryable<Pokemon> WithDetails() => context.Pokemon
        .Include(p => p.PokemonTypes).ThenInclude(pt => pt.Type)
        .Include(p => p.PokemonStats).ThenInclude(ps => ps.Stat)
        .Include(p => p.PokemonAbilities).ThenInclude(pa => pa.Ability);
}
