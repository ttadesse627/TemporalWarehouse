


using Microsoft.AspNetCore.Mvc;
using Moq;
using TemporalWarehouse.Api.Application.Interfaces;
using TemporalWarehouse.Api.Application.Services;
using TemporalWarehouse.Api.Contracts.RequestDtos;
using TemporalWarehouse.Api.Controllers;

namespace TemporalWarehouse.Test.Controllers;

public class StockControllerTests
{
    [Fact]
    public async Task AddStock_ShouldReturnOk()
    {
        var stockService = new Mock<IStockService>();
        stockService.Setup(s => s.AddStockAsync(It.IsAny<Guid>(), It.IsAny<int>()))
            .Returns(Task.CompletedTask);

        var controller = new StockController(stockService.Object);
        var result = await controller.AddStock(Guid.NewGuid(), new AddStockRequest { Quantity = 10 });

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task RemoveStock_ShouldReturnBadRequest_WhenBelowZero()
    {
        var stockService = new Mock<IStockService>();
        stockService.Setup(s => s.RemoveStockAsync(It.IsAny<Guid>(), It.IsAny<int>()))
            .ThrowsAsync(new InvalidOperationException("Stock cannot drop below zero."));

        var controller = new StockController(stockService.Object);
        var result = await controller.RemoveStock(Guid.NewGuid(), new RemoveStockRequest { Quantity = 50 });

        var badResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Stock cannot drop below zero.", badResult.Value);
    }
}
