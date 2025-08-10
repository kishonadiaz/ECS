namespace ECS.Core.Entities;
public class Employee
{
    public int EmployeeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "Employee";
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = "Pass123!"; // dev only
}