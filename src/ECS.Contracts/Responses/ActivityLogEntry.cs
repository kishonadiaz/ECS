namespace ECS.Contracts.Responses;
public record ActivityLogEntry
{
    public int? LogId { get; init; }
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
    public string Action { get; init; } = string.Empty;
    public string MemberName { get; init; } = string.Empty;
}