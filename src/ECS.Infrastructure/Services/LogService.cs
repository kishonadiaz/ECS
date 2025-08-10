using ECS.Core.Services;
using ECS.Contracts.Responses;
using ECS.Infrastructure.InMemory;
using ECS.Core.Entities;

namespace ECS.Infrastructure.Services;

// TODO: Save activity logs in the database so we can review who did what into the database so we can look at them in the future; consider saving several at the same time
 public class LogService : ILogService
{
    public Task WriteAsync(ActivityLogEntry entry)
    {
        var log = new ActivityLog
        {
            LogId = InMemoryStore.ActivityLogs.Count == 0 ? 1 : InMemoryStore.ActivityLogs.Max(l => l.LogId) + 1,
            Timestamp = entry.Timestamp,
            Action = entry.Action,
            MemberName = entry.MemberName
        };
        InMemoryStore.ActivityLogs.Add(log);
        return Task.CompletedTask;
    }
}