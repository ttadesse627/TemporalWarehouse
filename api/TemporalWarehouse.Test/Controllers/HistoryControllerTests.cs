


using Microsoft.AspNetCore.Mvc;
using Moq;
using TemporalWarehouse.Api.Application.Interfaces;
using TemporalWarehouse.Api.Application.Services;
using TemporalWarehouse.Api.Controllers;
using TemporalWarehouse.Api.Models.Entities;

namespace TemporalWarehouse.Test.Controllers;

public class HistoryControllerTests
{
    [Fact]
    public async Task GetHistory_ShouldReturnNotFound_WhenProductMissing()
    {
        var historyService = new Mock<IHistoryService>();
        var productService = new Mock<IProductService>();

        productService.Setup(p => p.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Product?)null);

        var controller = new HistoryController(historyService.Object, productService.Object);

        var result = await controller.GetHistory(Guid.NewGuid());

        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task GetStockAt_ShouldReturnCorrectValue()
    {
        var productId = Guid.NewGuid();

        var productService = new Mock<IProductService>();
        productService.Setup(p => p.GetByIdAsync(productId))
            .ReturnsAsync(new Product { Id = productId });

        var historyService = new Mock<IHistoryService>();
        historyService.Setup(h => h.GetStockAtTimeAsync(productId, It.IsAny<DateTime>()))
            .ReturnsAsync(12);

        var controller = new HistoryController(historyService.Object, productService.Object);

        var result = await controller.GetStockAt(productId, DateTime.UtcNow);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(12, ok.Value?.GetType().GetProperty("StockAtGivenTime")!.GetValue(ok.Value));
    }
}
