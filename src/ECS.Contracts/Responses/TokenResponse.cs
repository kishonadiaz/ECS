namespace ECS.Contracts.Responses;
public record TokenResponse
{
    public string Token { get; init; } = string.Empty;
}