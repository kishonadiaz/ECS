using Microsoft.AspNetCore.Mvc;
using ECS.Core.Entities;
using ECS.Infrastructure.InMemory;
using ECS.Contracts.Requests;

namespace ECS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        // GET: api/transactions
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(InMemoryStore.CheckoutTransactions);
        }

        // GET: api/transactions/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var item = InMemoryStore.CheckoutTransactions
                .FirstOrDefault(t => t.TransactionId == id);

            if (item is null) return NotFound();
            return Ok(item);
        }

        // GET: api/transactions/open
        [HttpGet("open")]
        public IActionResult GetOpen()
        {
            var open = InMemoryStore.CheckoutTransactions
                .Where(t => t.CheckedInAt == null);

            return Ok(open);
        }

        // POST: api/transactions/checkout
        [HttpPost("checkout")]
        public IActionResult Checkout([FromBody] CheckoutRequest req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var tx = new CheckoutTransaction
            {
                TransactionId = InMemoryStore.NextTransactionId(),
                EmployeeId = req.EmployeeId,
                EquipmentId = req.EquipmentId,
                CheckedOutAt = DateTime.UtcNow,
                CheckedInAt = null
            };

            InMemoryStore.CheckoutTransactions.Add(tx);

            return CreatedAtAction(nameof(GetById), new { id = tx.TransactionId }, tx);
        }

        // POST: api/transactions/{id}/checkin
        [HttpPost("{id:int}/checkin")]
        public IActionResult Checkin(int id, [FromBody] CheckinRequest req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var tx = InMemoryStore.CheckoutTransactions
                .FirstOrDefault(t => t.TransactionId == id);

            if (tx is null || tx.CheckedInAt != null) return NotFound();

            tx.CheckedInAt = req.WhenUtc;
            return Ok(tx);
        }

        // DELETE: api/transactions/{id}
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var removed = InMemoryStore.CheckoutTransactions
                .RemoveAll(t => t.TransactionId == id);

            if (removed == 0) return NotFound();
            return NoContent();
        }
    }
}
