using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using PokemonApi.Data.Context;
using PokemonApi.Data.Repositories.Interfaces;

namespace PokemonApi.Data.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly PokemonDbContext _context;
    private IDbContextTransaction? _transaction;
    
    public IPokemonRepository Pokemon { get; }

    public UnitOfWork(PokemonDbContext context)
    {
        _context = context;
        Pokemon = new PokemonRepository(_context);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
