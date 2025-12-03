

using Microsoft.AspNetCore.Mvc;
using TemporalWarehouse.Api.Application.Interfaces;
using TemporalWarehouse.Api.Contracts.ResponseDtos;

namespace TemporalWarehouse.Api.Controllers;

[ApiController]
[Route("api/products/{productId:guid}/[controller]")]
public class HistoryController(IHistoryService historyService, IProductService productService) : ControllerBase
{
    private readonly IHistoryService _historyService = historyService;
    private readonly IProductService _productService = productService;

    [HttpGet]
    public async Task<ActionResult<List<StockTransactionResponse>>> GetHistory(Guid productId)
    {
        var product = await _productService.GetByIdAsync(productId);
        if (product == null)
            return NotFound("Product not found.");

        var history = await _historyService.GetHistoryAsync(productId);

        return history.Select(t => new StockTransactionResponse
        {
            OccurredAt = t.OccurredAt,
            Type = t.Type,
            QuantityChanged = t.QuantityChanged,
            NewTotal = t.NewTotal
        }).ToList();
    }

    [HttpGet("stock-at")]
    public async Task<ActionResult<int>> GetStockAt(Guid productId, [FromQuery] DateTime dateTime)
    {
        var product = await _productService.GetByIdAsync(productId);

        if (product == null)
            return NotFound("Product not found.");

        var value = await _historyService.GetStockAtTimeAsync(productId, dateTime);

        return Ok(new { StockAtGivenTime = value });
    }
}
