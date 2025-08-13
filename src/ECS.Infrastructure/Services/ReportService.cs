using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECS.Contracts.Responses;
using ECS.Core.Services;


namespace ECS.Infrastructure.Services
{
    public class ReportService : IReportService
    {
        public async Task<IReadOnlyList<MonthlyCountResponse>> GetEmployeeMonthlyCheckoutsAsync(
            int employeeId, DateTime fromUtc, DateTime toUtc)
        {
            // TODO: Replace with real database logic later
            var dummyData = new List<MonthlyCountResponse>
            {
                new MonthlyCountResponse { Month = "2025-01", Count = 5 },
                new MonthlyCountResponse { Month = "2025-02", Count = 8 },
                new MonthlyCountResponse { Month = "2025-03", Count = 12 },
                new MonthlyCountResponse { Month = "2025-04", Count = 15 },
                new MonthlyCountResponse { Month = "2025-05", Count = 10 },
                new MonthlyCountResponse { Month = "2025-06", Count = 18 },
                new MonthlyCountResponse { Month = "2025-07", Count = 22 },
            };
            return await Task.FromResult(dummyData);
        }
    }
}