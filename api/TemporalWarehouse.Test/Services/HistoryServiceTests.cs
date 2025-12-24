using Moq;
using TemporalWarehouse.Api.Application.Services;
using TemporalWarehouse.Api.Models.Entities;



namespace TemporalWarehouse.Test.Services;

public class HistoryServiceTests
{
    [Fact]
    public async Task GetStockAtTimeAsync_ShouldReturnCorrectHistoricalValue()
    {
        var productId = Guid.NewGuid();

        var stockRepository = Helpers.MockFactory.StockRepository();
        stockRepository.Setup(r => r.GetBeforeAsync(productId, It.IsAny<DateTime>()))
            .ReturnsAsync(new StockTransaction { NewTotal = 5, OccurredAt = DateTime.UtcNow.AddMinutes(-10) });

        var service = new HistoryService(stockRepository.Object);

        var result = await service.GetStockAtTimeAsync(productId, DateTime.UtcNow);

        Assert.Equal(8, result);
    }

    [Fact]
    public async Task GetStockAtTimeAsync_ShouldReturnZeroIfNoHistory()
    {
        var productId = Guid.NewGuid();

        var stockRepository = Helpers.MockFactory.StockRepository();
        stockRepository.Setup(r => r.GetBeforeAsync(productId, It.IsAny<DateTime>()))
            .ReturnsAsync((StockTransaction?)null);

        var service = new HistoryService(stockRepository.Object);
        var result = await service.GetStockAtTimeAsync(productId, DateTime.UtcNow);

        Assert.Equal(0, result);
    }
}
