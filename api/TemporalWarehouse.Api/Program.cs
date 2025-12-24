using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TemporalWarehouse.Api.Application.Interfaces;
using TemporalWarehouse.Api.Application.Services;
using TemporalWarehouse.Api.Infrastructure.Contexts;
using TemporalWarehouse.Api.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8000);
});

builder.Services.AddControllers();
builder.Services.AddDbContext<WarehouseDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("NpgsqlConnection"));
    // options.UseNpgsql(builder.WebHost.Environment("NpgsqlConnection"));
}, ServiceLifetime.Scoped);

builder.Services.AddTransient<IProductRepository, ProductRepository>();
builder.Services.AddTransient<IStockRepository, StockRepository>();

builder.Services.AddTransient<IProductService, ProductService>();
builder.Services.AddScoped<IStockService, StockService>();
builder.Services.AddScoped<IHistoryService, HistoryService>();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "The Temporal Warehouse API" });
});
builder.Services.AddCors(options =>
    {
        options.AddPolicy("WarehouseCorsPolicy", builder =>
        {
            builder.WithOrigins("http://localhost:3000") // Specify allowed origins
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
    });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("WarehouseCorsPolicy");
app.UseHttpsRedirection();
app.MapControllers();

app.Run();
