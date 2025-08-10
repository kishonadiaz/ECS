using ECS.Core.Entities;
using ECS.Core.Services;
using ECS.Contracts.Requests;
using ECS.Contracts.Responses;
using ECS.Infrastructure.InMemory;

namespace ECS.Infrastructure.Services;

public class EmployeeService : IEmployeeService
{
public Task<UserResponse> RegisterAsync(RegisterEmployeeRequest request)
    {
        var nextId = InMemoryStore.Employees.Count == 0 ? 1 : InMemoryStore.Employees.Max(e => e.EmployeeId) + 1;
        var emp = new Employee
        {
            EmployeeId = nextId,
            Name = request.Name,
            Email = request.Email,
            Role = request.Role ?? "Employee",
            Username = request.Email,
            Password = "Pass123!"
        };
        InMemoryStore.Employees.Add(emp);
        return Task.FromResult(new UserResponse { UserId = emp.EmployeeId, Name = emp.Name, Role = emp.Role });
    }

// TODO: Replace with the database lookup; return null/404 as appropriate
 public Task<UserResponse?> GetAsync(int id)
    {
        var e = InMemoryStore.Employees.FirstOrDefault(x => x.EmployeeId == id);
        if (e == null) return Task.FromResult<UserResponse?>(null);
        return Task.FromResult<UserResponse?>(new UserResponse { UserId = e.EmployeeId, Name = e.Name, Role = e.Role });
    }
}