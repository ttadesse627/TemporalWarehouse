
using TemporalWarehouse.Api.Models.Enums;


namespace TemporalWarehouse.Api.Contracts.ResponseDtos;

public class StockTransactionResponse
{
    public DateTime OccurredAt { get; set; }
    public StockTransactionType Type { get; set; }
    public int QuantityChanged { get; set; }
    public int NewTotal { get; set; }
}