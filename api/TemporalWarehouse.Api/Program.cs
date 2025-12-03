using Microsoft.EntityFrameworkCore;
using TemporalWarehouse.Api.Application.Interfaces;
using TemporalWarehouse.Api.Application.Services;
using TemporalWarehouse.Api.Infrastructure.Contexts;
using TemporalWarehouse.Api.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Dependency Registration
builder.Services.AddDbContext<WarehouseDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddTransient<IProductRepository, ProductRepository>();
builder.Services.AddTransient<IStockRepository, StockRepository>();

builder.Services.AddTransient<IProductService, ProductService>();
builder.Services.AddTransient<IStockService, StockService>();
builder.Services.AddTransient<IHistoryService, HistoryService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.Run();
