using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ECS.Infrastructure.InMemory;
using ECS.Core.Entities;

var builder = Host.CreateApplicationBuilder(args);
// TODO: Use the database instead of in-memory data and read the check interval from settings
 builder.Services.AddHostedService<OverdueJob>();
var host = builder.Build();
await host.RunAsync();

public class OverdueJob : BackgroundService
{
    private readonly ILogger<OverdueJob> _logger;
    public OverdueJob(ILogger<OverdueJob> logger) => _logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("OverdueJob started");
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var now = DateTime.UtcNow;
// TODO: Query the database for late records; avoid creating duplicate notifications
 var overdue = InMemoryStore.Equipment.Where(e => e.Status == "CheckedOut" && e.ReturnDueDate != null && e.ReturnDueDate < now).ToList();
                foreach (var item in overdue)
                {
                    var alertId = InMemoryStore.Alerts.Count == 0 ? 1 : InMemoryStore.Alerts.Max(a => a.AlertId) + 1;
                    InMemoryStore.Alerts.Add(new Alert { AlertId = alertId, AlertType = "Overdue", TriggerDate = now, RecipientEmployeeId = item.AssignedEmployeeId });
                    _logger.LogInformation("Overdue alert created for item {ItemId}", item.EquipmentId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in OverdueJob");
            }

            await Task.Delay(TimeSpan.FromMinutes(2), stoppingToken);
        }
    }
}