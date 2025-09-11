namespace PokemonApi.Data.Repositories.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IPokemonRepository Pokemon { get; }
    ITypeRepository Types { get; }
    IStatRepository Stats { get; }
    IAbilityRepository Abilities { get; }
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
