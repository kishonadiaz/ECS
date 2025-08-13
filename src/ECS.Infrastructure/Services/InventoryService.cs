using ECS.Core.Entities;
using ECS.Core.Services;
using ECS.Contracts.Requests;
using ECS.Infrastructure.InMemory;

namespace ECS.Infrastructure.Services;

public class InventoryService : IInventoryService
{
public Task CheckoutAsync(CheckoutRequest request)
    {
        var emp = InMemoryStore.Employees.FirstOrDefault(e => e.EmployeeId == request.EmployeeId)
                  ?? throw new InvalidOperationException("Employee not found");
        var item = InMemoryStore.Equipment.FirstOrDefault(e => e.EquipmentId == request.EquipmentId)
                   ?? throw new InvalidOperationException("Equipment not found");
        if (item.Status == "CheckedOut") throw new InvalidOperationException("Equipment already checked out");

        item.Status = "CheckedOut";
        item.AssignedEmployeeId = emp.EmployeeId;
        item.CheckoutDate = DateTime.UtcNow;
        item.ReturnDueDate = DateTime.UtcNow.AddDays(7);

        InMemoryStore.ActivityLogs.Add(new ActivityLog { LogId = NewLogId(), Action = $"Checkout {item.Name} to {emp.Name}", MemberName = emp.Name, Timestamp = DateTime.UtcNow });
        return Task.CompletedTask;
    }

//public Task GetEquipments(RequestEquipment request)
//    {
//        var emp = InMemoryStore.Employees.FirstOrDefault(e => e.EmployeeId == request.UserId)
//                  ?? throw new InvalidOperationException("Employee not found");
//        var item = InMemoryStore.Equipment.FirstOrDefault(e => e.EquipmentId == request.EquipmentId)
//                   ?? throw new InvalidOperationException("Equipment not found");
        
       
//    }

    public Task RequestEquipmentAync(RequestEquipment request)
    {
        throw new NotImplementedException();
    }

    // TODO: Handle late returns (fees/flags) 
    public Task ReturnAsync(ReturnRequest request)
    {
        var item = InMemoryStore.Equipment.FirstOrDefault(e => e.EquipmentId == request.EquipmentId)
                   ?? throw new InvalidOperationException("Equipment not found");
        if (item.Status != "CheckedOut" || item.AssignedEmployeeId != request.EmployeeId)
            throw new InvalidOperationException("Item not checked out to this employee");

        var emp = InMemoryStore.Employees.FirstOrDefault(e => e.EmployeeId == request.EmployeeId)
                  ?? throw new InvalidOperationException("Employee not found");

        item.Status = "Available";
        item.AssignedEmployeeId = null;
        item.CheckoutDate = null;
        item.ReturnDueDate = null;

        InMemoryStore.ActivityLogs.Add(new ActivityLog { LogId = NewLogId(), Action = $"Return {item.Name} from {emp.Name}", MemberName = emp.Name, Timestamp = DateTime.UtcNow });
        return Task.CompletedTask;
    }

    public Task SetAvailabilityAsync(int equipmentId, SetAvailabilityRequest request)
    {
        // Find the equipment
        var item = InMemoryStore.Equipment.FirstOrDefault(e => e.EquipmentId == equipmentId)
                   ?? throw new InvalidOperationException("Equipment not found");

        // Flip status based on the boolean
        if (request.Available)
        {
            // Mark available — clear any checkout-related fields
            item.Status = "Available";
            item.AssignedEmployeeId = null;
            item.CheckoutDate = null;
            item.ReturnDueDate = null;

            InMemoryStore.ActivityLogs.Add(new ActivityLog
            {
                LogId = NewLogId(),
                Action = $"Set Available: {item.Name}",
                MemberName = "system",
                Timestamp = DateTime.UtcNow
            });
        }
        else
        {
            // Mark not available / checked-out (just a flag)
            // This does NOT assign an employee or dates; it’s just an admin toggle
            item.Status = "CheckedOut";

            InMemoryStore.ActivityLogs.Add(new ActivityLog
            {
                LogId = NewLogId(),
                Action = $"Set Unavailable: {item.Name}",
                MemberName = "system",
                Timestamp = DateTime.UtcNow
            });
        }

        return Task.CompletedTask;
    }

    private int NewLogId() => InMemoryStore.ActivityLogs.Count == 0 ? 1 : InMemoryStore.ActivityLogs.Max(l => l.LogId) + 1;
}             