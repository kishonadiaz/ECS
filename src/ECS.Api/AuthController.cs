using ECS.Core.Services;
using ECS.Contracts.Requests;
using ECS.Contracts.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting; // for IHostEnvironment and IsDevelopment

namespace ECS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;
        private readonly IHostEnvironment _env;

        // Constructor takes both services
        public AuthController(IAuthService auth, IHostEnvironment env)
        {
            _auth = auth;
            _env = env;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var token = await _auth.LoginAsync(request);
                return Ok(new TokenResponse { Token = token });
            }
            catch (UnauthorizedAccessException ex)
            {
                // Show the exact message only in Development
                var message = _env.IsDevelopment() ? ex.Message : "Invalid credentials";
                return Unauthorized(new { message });
            }
        }
    }
}