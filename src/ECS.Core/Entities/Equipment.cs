namespace ECS.Core.Entities;
public class Equipment
{
    public int EquipmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = "Available";
    public DateTime? CheckoutDate { get; set; }
    public DateTime? ReturnDueDate { get; set; }
    public int? AssignedEmployeeId { get; set; }
}