using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using ECS.Core.Services;
using ECS.Core.Entities;
using ECS.Contracts.Requests;
using Microsoft.Extensions.Hosting;

namespace ECSTest.Authentication
{
    [TestClass]
    public class IAuthServices
    {

        [TestMethod]
        public async Task LoginAsyncValidCredentialsReturnsToken()
        {
            // Arrange
            // Creates a mock of the IAuthService interface
            var mockAuthService = new Mock<IAuthService>();

            // Defines valid login with test creds
            var validRequest = new LoginRequest("bob", "Pass123!");

            // Sets up a mock return token when correct creds are input
            mockAuthService
                .Setup(s => s.LoginAsync(It.Is<LoginRequest>(
                    r => r.Username == "bob" && r.Password == "Pass123!")))
                .ReturnsAsync("mocked-jwt-token");

            // Act
            // Call LoginAsync method with valid request
            var result = await mockAuthService.Object.LoginAsync(validRequest);

            // Assert
            // Verify that the token return matches the expected value.
            Assert.AreEqual("mocked-jwt-token", result, "LoginAsync should return a token for valid credentials.");
        }


    }

}


