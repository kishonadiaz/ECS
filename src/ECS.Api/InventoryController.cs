using ECS.Core.Services;
using ECS.Contracts.Requests;
using Microsoft.AspNetCore.Mvc;
using ECS.Core.Entities;
using ECS.Infrastructure.InMemory;
using System.Diagnostics;

namespace ECS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventory;
        public InventoryController(IInventoryService inventory) => _inventory = inventory;

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            Debug.WriteLine(request.EmployeeId);
            Debug.WriteLine("Above");

            // TODO: Save activity logs in the database so we can review who did what in tokens
            await _inventory.CheckoutAsync(request);
            return Ok();
        }

        [HttpPost("return")]
        public async Task<IActionResult> Return([FromBody] ReturnRequest request)
        {
            // TODO: Save activity logs in the database so we can review who did what in tokens
            await _inventory.ReturnAsync(request);
            return Ok();
        }
    }
}
