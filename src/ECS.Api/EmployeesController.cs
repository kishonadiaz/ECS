using ECS.Core.Services;
using ECS.Contracts.Requests;
using Microsoft.AspNetCore.Mvc;

namespace ECS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _employees;
    public EmployeesController(IEmployeeService employees) => _employees = employees;

    [HttpPost]
    public async Task<IActionResult> Register([FromBody] RegisterEmployeeRequest request)
    {
        return Ok(await _employees.RegisterAsync(request));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _employees.GetAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }
}