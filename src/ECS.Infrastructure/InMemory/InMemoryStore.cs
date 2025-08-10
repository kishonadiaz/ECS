using ECS.Core.Entities;

namespace ECS.Infrastructure.InMemory;

public static class InMemoryStore
{
    public static List<Employee> Employees { get; } = new();
    public static List<Equipment> Equipment { get; } = new();
    public static List<ActivityLog> ActivityLogs { get; } = new();
    public static List<Alert> Alerts { get; } = new();
}