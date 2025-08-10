namespace ECS.Core.Entities;
public class Alert
{
    public int AlertId { get; set; }
    public string AlertType { get; set; } = string.Empty;
    public DateTime TriggerDate { get; set; }
    public int? RecipientEmployeeId { get; set; }
}