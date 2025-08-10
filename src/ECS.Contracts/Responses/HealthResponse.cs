namespace ECS.Contracts.Responses;
public record HealthResponse
{
    public string Status { get; init; } = "OK";
    public string Service { get; init; } = "ECS.Api";
}