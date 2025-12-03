


using Microsoft.AspNetCore.Mvc;
using Moq;
using TemporalWarehouse.Api.Application.Interfaces;
using TemporalWarehouse.Api.Application.Services;
using TemporalWarehouse.Api.Controllers;
using TemporalWarehouse.Api.Models.Entities;

namespace TemporalWarehouse.Test.Controllers;

public class ProductsControllerTests
{
    [Fact]
    public async Task GetById_ShouldReturnNotFound_WhenMissing()
    {
        var service = new Mock<IProductService>() { CallBase = false };
        service.Setup(s => s.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Product?)null);

        var controller = new ProductsController(service.Object);

        var result = await controller.GetById(Guid.NewGuid());

        Assert.IsType<NotFoundResult>(result.Result);
    }
}
