using ECS.Contracts.Requests;
namespace ECS.Core.Services;
public interface IAuthService
{
    Task<string> LoginAsync(LoginRequest request);
}