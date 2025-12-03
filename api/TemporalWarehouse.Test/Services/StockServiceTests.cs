


using Microsoft.EntityFrameworkCore;
using Moq;
using TemporalWarehouse.Api.Application.Services;
using TemporalWarehouse.Api.Models.Entities;

namespace TemporalWarehouse.Test.Services;

public class StockServiceTests
{
    [Fact]
    public async Task AddStockAsync_ShouldIncreaseQuantity()
    {
        var product = new Product { Id = Guid.NewGuid(), CurrentQuantity = 10 };

        var productRepository = Helpers.MockFactory.ProductRepository();
        var stockRepository = Helpers.MockFactory.StockRepository();

        productRepository.Setup(r => r.GetByIdAsync(product.Id))
            .ReturnsAsync(product);

        var service = new StockService(productRepository.Object, stockRepository.Object);

        await service.AddStockAsync(product.Id, 5);

        Assert.Equal(15, product.CurrentQuantity);
        stockRepository.Verify(r => r.AddAsync(It.IsAny<StockTransaction>()), Times.Once);
        productRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
    }


    [Fact]
    public async Task RemoveStockAsync_ShouldDecreaseQuantity()
    {
        var product = new Product { Id = Guid.NewGuid(), CurrentQuantity = 20 };

        var productRepository = Helpers.MockFactory.ProductRepository();
        var stockRepository = Helpers.MockFactory.StockRepository();

        productRepository.Setup(r => r.GetByIdAsync(product.Id))
            .ReturnsAsync(product);

        var service = new StockService(productRepository.Object, stockRepository.Object);

        await service.RemoveStockAsync(product.Id, 5);

        Assert.Equal(15, product.CurrentQuantity);
        stockRepository.Verify(r => r.AddAsync(It.IsAny<StockTransaction>()), Times.Once);
        productRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
    }


    [Fact]
    public async Task RemoveStockAsync_ShouldThrowIfBelowZero()
    {
        var product = new Product { Id = Guid.NewGuid(), CurrentQuantity = 2 };

        var productRepository = Helpers.MockFactory.ProductRepository();
        var stockRepository = Helpers.MockFactory.StockRepository();

        productRepository.Setup(r => r.GetByIdAsync(product.Id))
            .ReturnsAsync(product);

        var service = new StockService(productRepository.Object, stockRepository.Object);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.RemoveStockAsync(product.Id, 5));
    }

    [Fact]
    public async Task RemoveStockAsync_ShouldThrowConcurrencyException()
    {
        var product = new Product { Id = Guid.NewGuid(), CurrentQuantity = 10 };

        var productRepository = Helpers.MockFactory.ProductRepository();
        var stockRepository = Helpers.MockFactory.StockRepository();

        productRepository.Setup(r => r.GetByIdAsync(product.Id))
            .ReturnsAsync(product);

        productRepository.Setup(r => r.SaveChangesAsync())
            .ThrowsAsync(new DbUpdateConcurrencyException());

        var service = new StockService(productRepository.Object, stockRepository.Object);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.RemoveStockAsync(product.Id, 3));
    }
}

