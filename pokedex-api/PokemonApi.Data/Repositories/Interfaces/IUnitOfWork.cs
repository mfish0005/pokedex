namespace PokemonApi.Data.Repositories.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IPokemonRepository Pokemon { get; }
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
