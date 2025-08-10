using ECS.Core.Services;
using ECS.Contracts.Requests;
using ECS.Infrastructure.InMemory;

namespace ECS.Infrastructure.Services;

public class AuthService : IAuthService
{
    public Task<string> LoginAsync(LoginRequest request)
    {
        var user = InMemoryStore.Employees.FirstOrDefault(u => u.Username == request.Username && u.Password == request.Password);
        if (user == null) throw new UnauthorizedAccessException("Invalid credentials");
        return Task.FromResult($"token-{user.EmployeeId}-{Guid.NewGuid()}");
    }
}