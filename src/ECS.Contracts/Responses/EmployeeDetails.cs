namespace ECS.Contracts.Responses;
public record EmployeeDetails
{
    public int EmployeeId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
}