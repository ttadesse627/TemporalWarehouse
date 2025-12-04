using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TemporalWarehouse.Api.Models.Entities;

namespace TemporalWarehouse.Api.Models.Configurations;

public class StockTransactionEntityConfiguration : IEntityTypeConfiguration<StockTransaction>
{
    public void Configure(EntityTypeBuilder<StockTransaction> builder)
    {
        builder.ToTable("stock_transactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Type)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(t => t.QuantityChanged)
            .IsRequired();

        builder.Property(t => t.NewTotal)
            .IsRequired();

        builder.Property(t => t.OccurredAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone");

        builder.HasIndex(t => t.ProductId);

        builder.HasOne(t => t.Product)
            .WithMany(p => p.StockTransactions)
            .HasForeignKey(t => t.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}