using ECS.Core.Services;
using ECS.Contracts.Requests;
using ECS.Infrastructure.InMemory;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ECS.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        public Task<string> LoginAsync(LoginRequest request)
        {
            // Find the user by username only
            var user = InMemoryStore.Employees
                .FirstOrDefault(u => u.Username == request.Username);

            if (user == null)
            {
                // Controller will decide whether to show this message
                throw new UnauthorizedAccessException("Invalid username");
            }

            // Check password separately
            if (user.Password != request.Password)
            {
                throw new UnauthorizedAccessException("Invalid password");
            }

            // Success: return token with EmployeeId and unique ID
            return Task.FromResult($"token-{user.EmployeeId}-{Guid.NewGuid()}");
        }
    }
}