using ECS.Contracts.Responses;
using ECS.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace ECS.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reports;

        public ReportsController(IReportService reports)
        {
            _reports = reports;
        }

        [HttpGet("employee/{employeeId:int}/checkouts-per-month")]
        public async Task<ActionResult<IReadOnlyList<MonthlyCountResponse>>> GetEmployeeMonthly(
            int employeeId,
            [FromQuery] int months = 12,
            [FromQuery] bool pad = true)
        {
            if (months <= 0 || months > 36) months = 12;

            var now = DateTime.UtcNow;
            var startOfThisMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var fromUtc = startOfThisMonth.AddMonths(-(months - 1));

            var data = await _reports.GetEmployeeMonthlyCheckoutsAsync(employeeId, fromUtc, now);

            if (!pad) return Ok(data);

            var map = data.ToDictionary(d => d.Month, d => d.Count);
            var padded = new List<MonthlyCountResponse>();
            for (int i = 0; i < months; i++)
            {
                var m = fromUtc.AddMonths(i);
                var key = $"{m.Year:D4}-{m.Month:D2}";
                padded.Add(new MonthlyCountResponse
                {
                    Month = key,
                    Count = map.TryGetValue(key, out var c) ? c : 0
                });
            }

            return Ok(padded);
        }
    }
}