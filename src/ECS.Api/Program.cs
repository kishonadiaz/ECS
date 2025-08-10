using ECS.Core.Services;
using ECS.Infrastructure.InMemory;
using ECS.Infrastructure.Services;
using ECS.Core.Entities;
using Microsoft.OpenApi.Models;
using ECS.Contracts.Responses;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => c.SwaggerDoc("v1", new OpenApiInfo { Title = "ECS API", Version = "v1" }));

// === Core Services ===
builder.Services.AddSingleton<IEmployeeService, EmployeeService>();
builder.Services.AddSingleton<IInventoryService, InventoryService>();
// TODO: Save activity logs in the database so we can review who did what
// TODO: Swap to the database implementation once the database is wired

// === Logging ===
builder.Services.AddSingleton<ILogService, LogService>();
// TODO: Replace with the database + real email/notification integration
// TODO: Save notifications to the database and connect real email/notifications

// === Alerts ===
builder.Services.AddSingleton<IAlertService, AlertService>();
// TODO: Save activity logs in the database so we can review who did what in tokens

// === Authentication ===
 builder.Services.AddSingleton<IAuthService, AuthService>();

var app = builder.Build();

// Basic exception mapping
app.Use(async (ctx, next) =>
{
    try { await next(); }
    catch (UnauthorizedAccessException ex) { ctx.Response.StatusCode = 401; await ctx.Response.WriteAsJsonAsync(new ErrorResponse { Error = ex.Message }); }
    catch (InvalidOperationException ex) { ctx.Response.StatusCode = 400; await ctx.Response.WriteAsJsonAsync(new ErrorResponse { Error = ex.Message }); }
});

app.UseSwagger();
app.UseSwaggerUI();

// Seed data
if (InMemoryStore.Employees.Count == 0)
{
    InMemoryStore.Employees.AddRange(new[] {
        new Employee { EmployeeId = 1, Name = "Alice", Email = "alice@ecs.com", Role = "Employee", Username="alice", Password="Pass123!" },
        new Employee { EmployeeId = 2, Name = "Bob",   Email = "bob@ecs.com",   Role = "Manager",  Username="bob",   Password="Pass123!" }
    });
}
if (InMemoryStore.Equipment.Count == 0)
{
    InMemoryStore.Equipment.AddRange(new[] {
        new Equipment { EquipmentId = 100, Name = "Laptop A", Status = "Available" },
        new Equipment { EquipmentId = 101, Name = "Camera A", Status = "Available" }
    });
}

app.MapGet("/health", () => Results.Ok(new HealthResponse { Status = "OK", Service = "ECS.Api" }));

// Debug read-only
app.MapGet("/api/debug/equipment", () => InMemoryStore.Equipment);
app.MapGet("/api/debug/employees", () => InMemoryStore.Employees.Select(e => new EmployeeDetails { EmployeeId = e.EmployeeId, Name = e.Name, Email = e.Email, Role = e.Role }));
app.MapGet("/api/debug/logs", () => InMemoryStore.ActivityLogs.OrderByDescending(l => l.Timestamp));
app.MapGet("/api/debug/alerts", () => InMemoryStore.Alerts);

app.MapControllers();
app.Run();