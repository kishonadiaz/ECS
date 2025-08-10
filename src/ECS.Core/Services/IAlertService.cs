using ECS.Contracts.Requests;
namespace ECS.Core.Services;
public interface IAlertService
{
    Task CreateAsync(AlertInfo request);
    Task DeleteAsync(int id);
}