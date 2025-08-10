using ECS.Contracts.Requests;
using ECS.Contracts.Responses;
namespace ECS.Core.Services;
public interface IEmployeeService
{
    Task<UserResponse> RegisterAsync(RegisterEmployeeRequest request);
    Task<UserResponse?> GetAsync(int id);
}