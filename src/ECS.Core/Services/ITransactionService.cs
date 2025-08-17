using ECS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECS.Core.Services
{
    public interface ITransactionService
    {
        // Read
        IEnumerable<CheckoutTransaction> GetAll();
        IEnumerable<CheckoutTransaction> GetOpen();
        IEnumerable<CheckoutTransaction> GetByEmployee(int employeeId);
        IEnumerable<CheckoutTransaction> GetByEquipment(int equipmentId);

        // Commands
        CheckoutTransaction Checkout(int employeeId, int equipmentId, DateTime whenUtc);
        CheckoutTransaction? Checkin(int transactionId, DateTime whenUtc);
    }
}
