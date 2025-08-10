using ECS.Contracts.Responses;
namespace ECS.Core.Services;
public interface ILogService
{
    Task WriteAsync(ActivityLogEntry entry);
}