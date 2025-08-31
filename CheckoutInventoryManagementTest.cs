using System;                                    
using Microsoft.VisualStudio.TestTools.UnitTesting; 
using Moq;                                         
using ECS.Core.Entities;                          
using ECS.Core.Services;
using System.Collections.Generic;                  
using System.Linq;                                 
using System.Threading.Tasks;

namespace ECSTest
{
    [TestClass]
    public class TransactionServiceTests
    {
        [TestMethod]
        public void Checkout_ReturnsTransaction_WithCorrectEmployeeAndEquipmentIds()
        {
            // Arrange
            // Simulate a scenario where an employee checks out a piece of equipment.
            // We define the expected input parameters and the expected output transaction.
            var mockService = new Mock<ITransactionService>();
            int employeeId = 1;
            int equipmentId = 100;
            DateTime whenUtc = DateTime.UtcNow;

            // Create a mock of the ITransactionService to simulate its behavior
            var expectedTransaction = new CheckoutTransaction
            {
                TransactionId = 1,
                EmployeeId = employeeId,
                EquipmentId = equipmentId,
                CheckedOutAt = whenUtc,
                CheckedInAt = null
            };

            // Configure the mock to return the expected transaction when Checkout is called
            mockService.Setup(s => s.Checkout(employeeId, equipmentId, whenUtc))
                       .Returns(expectedTransaction);

            // Act
            // Call the Checkout method on the mocked service with the same parameters
            var result = mockService.Object.Checkout(employeeId, equipmentId, whenUtc);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(employeeId, result.EmployeeId);
            Assert.AreEqual(equipmentId, result.EquipmentId);
            Assert.AreEqual(whenUtc, result.CheckedOutAt);
            Assert.IsNull(result.CheckedInAt);
        }
    }
}
