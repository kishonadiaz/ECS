namespace ECS.Core.Entities;
public class ActivityLog
{
    public int LogId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string Action { get; set; } = string.Empty;
    public string MemberName { get; set; } = string.Empty;
}