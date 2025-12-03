
namespace TemporalWarehouse.Api.Contracts.RequestDtos;

public record UpdateProductRequest
{
    public string Name { get; set; } = null!;
    public string SKU { get; set; } = null!;
    public decimal Price { get; set; }
}