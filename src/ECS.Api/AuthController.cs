using ECS.Core.Services;
using ECS.Contracts.Requests;
using ECS.Contracts.Responses;
using Microsoft.AspNetCore.Mvc;

namespace ECS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
        => Ok(new TokenResponse { Token = await _auth.LoginAsync(request) });

    [HttpGet("login")]
    public async Task<IActionResult> LoginRestfully([FromQuery] LoginRequest request)
    {
        // Logic to retrieve user by ID
        var token = await _auth.LoginAsync(request);

        if (string.IsNullOrEmpty(token))
            return Unauthorized(new { message = "Invalid username or password" });

        return Ok(new TokenResponse { Token = token });
    }
}