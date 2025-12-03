


using Moq;
using TemporalWarehouse.Api.Application.Interfaces;

namespace TemporalWarehouse.Test.Helpers;

public static class MockFactory
{
    public static Mock<IProductRepository> ProductRepository()
        => new Mock<IProductRepository>();

    public static Mock<IStockRepository> StockRepository()
        => new Mock<IStockRepository>();
}