


using TemporalWarehouse.Api.Models.Entities;


namespace TemporalWarehouse.Api.Application.Interfaces;

public interface IHistoryService
{
    public Task<List<StockTransaction>> GetHistoryAsync(Guid productId);

    public Task<int> GetStockAtTimeAsync(Guid productId, DateTime timestamp);
}