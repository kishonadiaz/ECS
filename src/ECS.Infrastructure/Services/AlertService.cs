using ECS.Core.Services;
using ECS.Contracts.Requests;
using ECS.Infrastructure.InMemory;
using ECS.Core.Entities;

namespace ECS.Infrastructure.Services;

// TODO: Save notifications to the database; connect email/SMS in the future
 public class AlertService : IAlertService
{
public Task CreateAsync(AlertInfo request)
    {
        var alert = new Alert
        {
            AlertId = InMemoryStore.Alerts.Count == 0 ? 1 : InMemoryStore.Alerts.Max(a => a.AlertId) + 1,
            AlertType = request.AlertType,
            TriggerDate = request.TriggerDate,
            RecipientEmployeeId = request.RecipientEmployeeId
        };
        InMemoryStore.Alerts.Add(alert);
        InMemoryStore.ActivityLogs.Add(new ActivityLog { LogId = InMemoryStore.ActivityLogs.Count == 0 ? 1 : InMemoryStore.ActivityLogs.Max(l => l.LogId) + 1, Action = $"Alert created: {alert.AlertType}", MemberName = "system", Timestamp = DateTime.UtcNow });
        return Task.CompletedTask;
    }

    public Task DeleteAsync(int id)
    {
        var a = InMemoryStore.Alerts.FirstOrDefault(x => x.AlertId == id) ?? throw new InvalidOperationException("Alert not found");
        InMemoryStore.Alerts.Remove(a);
        return Task.CompletedTask;
    }
}