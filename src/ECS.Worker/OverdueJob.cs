using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ECS.Infrastructure.InMemory;

namespace ECS.Worker
{
    public class OverdueJob : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var now = DateTime.UtcNow;
                // TODO: Use the database instead of in-memory data and read the check interval from settings
                var overdue = InMemoryStore.Equipment.Where(e => e.Status == "CheckedOut" && e.ReturnDueDate < now);
                // TODO: Add one notification per late item (no duplicates)
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}