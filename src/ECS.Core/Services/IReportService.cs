using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECS.Contracts.Responses;

namespace ECS.Core.Services
{
    public interface IReportService
    {
        Task<IReadOnlyList<MonthlyCountResponse>> GetEmployeeMonthlyCheckoutsAsync(
            int employeeId, DateTime fromUtc, DateTime toUtc);
    }
}
