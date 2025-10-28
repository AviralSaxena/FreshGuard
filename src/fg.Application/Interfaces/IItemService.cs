using fg.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace fg.Application.Interfaces
{
    public interface IItemService
    {
        Task<IEnumerable<Items>> GetAllItems();
        Task<List<Items>?> GetItemByUserId(string userId); 
        Task<Items?> GetItemById(string id, string partitionKey);
        Task<Items> CreateItem(Items item, IFormFile? file = null); 
        Task<Items?> UpdateItem(string id, string partitionKey, Items updatedItem, IFormFile? file = null);
        Task<bool> DeleteItem(string id, string partitionKey);
    }
}
