using TemporalWarehouse.Api.Models.Enums;


namespace TemporalWarehouse.Api.Models.Entities;

public class StockTransaction
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public DateTime OccurredAt { get; set; }
    public StockTransactionType Type { get; set; }

    public int QuantityChanged { get; set; }
    public int NewTotal { get; set; }
}