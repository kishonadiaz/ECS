using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECS.Core.Entities
{
        public class CheckoutTransaction
        {
            public int TransactionId { get; set; }
            public int EmployeeId { get; set; }
            public int EquipmentId { get; set; }

            // When the item was checked out
            public DateTime CheckedOutAt { get; set; }

            // When the item was returned (null = still out)
            public DateTime? CheckedInAt { get; set; }
        }
}
