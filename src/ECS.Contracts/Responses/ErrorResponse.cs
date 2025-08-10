namespace ECS.Contracts.Responses;
public record ErrorResponse
{
    public string Error { get; init; } = string.Empty;
}