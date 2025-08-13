using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECS.Contracts.Responses
{
    public class MonthlyCountResponse
    {
        public string Month { get; set; } = default!; // "YYYY-MM"
        public int Count { get; set; }
    }
}
