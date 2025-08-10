namespace ECS.Core.Entities;
public class Material
{
    public int MaterialId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int Quantity { get; set; }
}