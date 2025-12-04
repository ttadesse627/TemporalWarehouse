using TemporalWarehouse.Api.Models.Entities;

namespace TemporalWarehouse.Api.Application.Interfaces;

public interface IStockRepository
{
    Task AddAsync(StockTransaction transaction);
    Task<List<StockTransaction>> GetByProductAsync(Guid productId);
    Task<StockTransaction?> GetBeforeAsync(Guid productId, DateTime dateTime);
    Task SaveChangesAsync();
}