using ECS.Contracts.Requests;
namespace ECS.Core.Services;
public interface IInventoryService
{
    Task CheckoutAsync(CheckoutRequest request);
    Task ReturnAsync(ReturnRequest request);
    Task RequestEquipmentAync(RequestEquipment request);

    Task SetAvailabilityAsync(int equipmentId, SetAvailabilityRequest request);
}