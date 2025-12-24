using Moq;
using TemporalWarehouse.Api.Application.Services;
using TemporalWarehouse.Api.Models.Entities;
using TemporalWarehouse.Test.Helpers;


namespace TemporalWarehouse.Test.Services;

public class ProductServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldCreateProduct()
    {
        // Arrange
        var productRepository = Helpers.MockFactory.ProductRepository();
        var service = new ProductService(productRepository.Object);

        // Act
        var result = await service.CreateAsync("Test Product", "SKU123", 10.5m, 50);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Product", result.Name);
        Assert.Equal("SKU123", result.SKU);

        productRepository.Verify(r => r.AddAsync(It.IsAny<Product>()), Times.Once);
        productRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_ShouldThrowIfProductNotFound()
    {
        // Arrange
        var productRepository = Helpers.MockFactory.ProductRepository();
        productRepository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Product?)null);

        var service = new ProductService(productRepository.Object);

        // Act + Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            service.UpdateAsync(Guid.NewGuid(), "A", "B", 10));
    }
}