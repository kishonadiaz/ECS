using ECS.Core.Entities;
using ECS.Infrastructure.InMemory;
using Microsoft.AspNetCore.Mvc;

namespace ECS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        /// <summary>
        /// Production list of all equipment.
        /// </summary>
        [HttpGet]
        public ActionResult<IEnumerable<Equipment>> GetAll()
            => Ok(InMemoryStore.Equipment);

        /// <summary>
        /// Equipment allowed for a specific employee. For now:
        /// allowed == everything. Use onlyAvailable=true to filter by status.
        /// </summary>
        [HttpGet("allowed")]
        public ActionResult<IEnumerable<Equipment>> GetAllowed(
            [FromQuery] int employeeId,
            [FromQuery] bool onlyAvailable = true)
        {
            var items = InMemoryStore.Equipment.AsEnumerable();

            if (onlyAvailable)
            {
                items = items.Where(e =>
                    string.Equals(e.Status, "Available", StringComparison.OrdinalIgnoreCase));
            }

            return Ok(items);
        }
    }
}