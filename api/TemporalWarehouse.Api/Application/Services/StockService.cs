using Microsoft.EntityFrameworkCore;
using TemporalWarehouse.Api.Application.Interfaces;
using TemporalWarehouse.Api.Models.Entities;
using TemporalWarehouse.Api.Models.Enums;


namespace TemporalWarehouse.Api.Application.Services;

public class StockService(IProductRepository productRepository, IStockRepository stockRepository) : IStockService
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly IStockRepository _stockRepository = stockRepository;

    public async Task AddStockAsync(Guid productId, int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive.");

        var product = await _productRepository.GetByIdAsync(productId)
            ?? throw new KeyNotFoundException("Product not found.");

        // Update quantity
        product.CurrentQuantity += quantity;

        // Append audit
        var trx = new StockTransaction
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            QuantityChanged = quantity,
            NewTotal = product.CurrentQuantity,
            Type = StockTransactionType.AddStock,
            OccurredAt = DateTime.UtcNow
        };

        await _stockRepository.AddAsync(trx);

        // Save with concurrency protection
        await _productRepository.SaveChangesAsync();
    }

    public async Task RemoveStockAsync(Guid productId, int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive.");

        var product = await _productRepository.GetByIdAsync(productId)
            ?? throw new KeyNotFoundException("Product not found.");

        var newTotal = product.CurrentQuantity - quantity;

        if (newTotal < 0)
            throw new InvalidOperationException("Stock cannot drop below zero.");

        // Mutate state
        product.CurrentQuantity = newTotal;

        // Append audit log
        var trx = new StockTransaction
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            QuantityChanged = quantity,
            NewTotal = newTotal,
            Type = StockTransactionType.RemoveStock,
            OccurredAt = DateTime.UtcNow
        };

        await _stockRepository.AddAsync(trx);

        try
        {
            await _productRepository.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new InvalidOperationException(
                "Stock update failed due to a concurrent modification.");
        }
    }
}