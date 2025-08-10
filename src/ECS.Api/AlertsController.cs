using ECS.Core.Services;
using ECS.Contracts.Requests;
using Microsoft.AspNetCore.Mvc;

namespace ECS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly IAlertService _alerts;
    public AlertsController(IAlertService alerts) => _alerts = alerts;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AlertInfo request)
    {
// TODO: Save activity logs in the database so we can review who did what in tokens
         await _alerts.CreateAsync(request);
        return Ok();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
// TODO: Require manager roles; return 404 if not found
         await _alerts.DeleteAsync(id);
        return NoContent();
    }
}