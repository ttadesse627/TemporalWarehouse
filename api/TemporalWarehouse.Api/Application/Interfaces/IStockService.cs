


namespace TemporalWarehouse.Api.Application.Interfaces;

public interface IStockService
{
    public Task AddStockAsync(Guid productId, int quantity);

    public Task RemoveStockAsync(Guid productId, int quantity);
}