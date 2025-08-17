using System.Linq;
using ECS.Core.Entities;

namespace ECS.Infrastructure.InMemory
{
    public static class InMemoryStore
    {
        public static List<Employee> Employees { get; } = new();
        public static List<Equipment> Equipment { get; } = new();
        public static List<ActivityLog> ActivityLogs { get; } = new();
        public static List<Alert> Alerts { get; } = new();

        // transactions
        public static List<CheckoutTransaction> CheckoutTransactions { get; } = new()
        {
            // a couple of seed rows so the UI has something to show
            new CheckoutTransaction
            {
                TransactionId = 1,
                EmployeeId    = 1000,         // Alice
                EquipmentId   = 100,          // Laptop A
                CheckedOutAt  = DateTime.UtcNow.AddDays(-2),
                CheckedInAt   = DateTime.UtcNow.AddDays(-1)
            },
            new CheckoutTransaction
            {
                TransactionId = 2,
                EmployeeId    = 1001,         // Bob (manager)
                EquipmentId   = 101,          // Camera A
                CheckedOutAt  = DateTime.UtcNow.AddHours(-8),
                CheckedInAt   = null          // still out
            }
        };

        // id generator
        public static int NextTransactionId() =>
            CheckoutTransactions.Count == 0
                ? 1
                : CheckoutTransactions.Max(t => t.TransactionId) + 1;
    }
}
