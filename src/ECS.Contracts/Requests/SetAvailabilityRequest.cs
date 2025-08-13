using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECS.Contracts.Requests
{
    public class SetAvailabilityRequest
    {
        // true = Available
        // false = Unavailable or Checkedout
        public bool Available { get; set; }
    }
}
