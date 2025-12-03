
using Microsoft.EntityFrameworkCore;
using TemporalWarehouse.Api.Infrastructure.Contexts;
using TemporalWarehouse.Api.Models.Entities;
using TemporalWarehouse.Api.Application.Interfaces;

namespace TemporalWarehouse.Api.Infrastructure.Repositories;

public class ProductRepository(WarehouseDbContext context) : IProductRepository
{
    private readonly WarehouseDbContext _context = context;

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Product>> GetAllAsync()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
    }

    public Task UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Product product)
    {
        _context.Products.Remove(product);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync()
    {
        return _context.SaveChangesAsync();
    }
}