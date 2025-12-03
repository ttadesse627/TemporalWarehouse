


using TemporalWarehouse.Api.Models.Entities;

namespace TemporalWarehouse.Api.Application.Interfaces;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id);
    Task<List<Product>> GetAllAsync();
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Product product);

    Task SaveChangesAsync();
}