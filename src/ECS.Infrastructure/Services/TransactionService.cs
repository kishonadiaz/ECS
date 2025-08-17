using System;
using System.Collections.Generic;
using System.Linq;
using ECS.Core.Entities;
using ECS.Core.Services;
using ECS.Infrastructure.InMemory;

namespace ECS.Infrastructure.Services
{
    public class TransactionService : ITransactionService
    {
        // Reads
        public IEnumerable<CheckoutTransaction> GetAll()
            => InMemoryStore.CheckoutTransactions;

        public IEnumerable<CheckoutTransaction> GetOpen()
            => InMemoryStore.CheckoutTransactions.Where(t => t.CheckedInAt == null);

        public IEnumerable<CheckoutTransaction> GetByEmployee(int employeeId)
            => InMemoryStore.CheckoutTransactions.Where(t => t.EmployeeId == employeeId);

        public IEnumerable<CheckoutTransaction> GetByEquipment(int equipmentId)
            => InMemoryStore.CheckoutTransactions.Where(t => t.EquipmentId == equipmentId);

        // Commands
        public CheckoutTransaction Checkout(int employeeId, int equipmentId, DateTime whenUtc)
        {
            var tx = new CheckoutTransaction
            {
                TransactionId = InMemoryStore.NextTransactionId(),
                EmployeeId = employeeId,
                EquipmentId = equipmentId,
                CheckedOutAt = whenUtc,
                CheckedInAt = null
            };

            InMemoryStore.CheckoutTransactions.Add(tx);
            return tx;
        }

        public CheckoutTransaction? Checkin(int transactionId, DateTime whenUtc)
        {
            var tx = InMemoryStore.CheckoutTransactions
                                  .FirstOrDefault(t => t.TransactionId == transactionId);

            if (tx is null || tx.CheckedInAt is not null)
                return null; // not found or already checked in

            tx.CheckedInAt = whenUtc;
            return tx;
        }
    }
}
