

namespace TemporalWarehouse.Api.Contracts.ResponseDtos;

public class ProductResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string SKU { get; set; } = null!;
    public decimal Price { get; set; }
    public int CurrentQuantity { get; set; }
}