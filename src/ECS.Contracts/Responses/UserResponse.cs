namespace ECS.Contracts.Responses;
public record UserResponse
{
    public int UserId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Role { get; init; } = "Employee";
}