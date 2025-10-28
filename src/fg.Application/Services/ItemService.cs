using fg.Application.Interfaces;
using fg.Domain.Entities;
using fg.Infrastructure.Data;
using fg.Infrastructure.Services;
using Microsoft.Azure.Cosmos;
// using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;


namespace fg.Application.Services
{
    public class ItemService : IItemService
    {
        private readonly Container _itemsContainer;
        private readonly BlobService _blobService;

        public ItemService(AppDbContext dbContext)
        {
            _itemsContainer = dbContext.ItemsContainer;
            _blobService = dbContext.ItemBlobService;
        }

        public async Task<IEnumerable<Items>> GetAllItems()
        {
            var query = _itemsContainer.GetItemQueryIterator<Items>("SELECT * FROM c");
            var results = new List<Items>();

            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response);
            }
            return results;
        }

        public async Task<List<Items>?> GetItemByUserId(string userId) 
        {
            var query = _itemsContainer.GetItemQueryIterator<Items>(
                new QueryDefinition("SELECT * FROM c WHERE c.userId = @userId")
                    .WithParameter("@userId", userId) 
            ); 

            var results = new List<Items>(); 
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync(); 
                foreach (var item in response)
                {
                    item.Percentage = CalculateExpiryPercentage(item.UploadedDate, item.ExpiryDate); 
                    results.Add(item); 
                }
            }
            return results; 
        }

        public async Task<Items?> GetItemById(string id, string partitionKey)
        {
            try
            {
                var query = _itemsContainer.GetItemQueryIterator<Items>(
                    new QueryDefinition("SELECT * FROM c WHERE c.id = @id")
                        .WithParameter("@id", id)
                );

                while (query.HasMoreResults)
                {
                    var response = await query.ReadNextAsync();
                    var item = response.FirstOrDefault();
                    if (item != null) return item;
                }
                return null;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<Items> CreateItem(Items item, IFormFile? file = null)
        {
            if (string.IsNullOrWhiteSpace(item.UserId))
                throw new ApplicationException("UserId is required for partition key.");

            var query = _itemsContainer.GetItemQueryIterator<Items>(
                new QueryDefinition("SELECT * FROM c WHERE c.itemId = @itemId AND c.userId = @userId")
                    .WithParameter("@itemId", item.ItemId)
                    .WithParameter("@userId", item.UserId));

            if (file != null && file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var contentType = file.ContentType;
                var imageUrl = await _blobService.UploadImageAsync(stream, fileName, contentType);
                item.ImageUrl = imageUrl;
            }

            item.Id = await GenerateNextIdForUser(item.UserId);
            item.ItemId = GenerateItemId(item.Name, item.UserId); 
            item.UploadedDate = DateTime.UtcNow;
            item.Percentage = CalculateExpiryPercentage(item.UploadedDate, item.ExpiryDate);

            var response = await _itemsContainer.CreateItemAsync(item, new PartitionKey(item.UserId));
            return response.Resource;
        }

        public async Task<Items?> UpdateItem(string id, string PartitionKey, Items updatedItem, IFormFile? file)
        {
            var existingItem = await GetItemById(id, updatedItem.UserId);
            if (existingItem == null) return null;

            updatedItem.Id = id;
            updatedItem.UploadedDate = existingItem.UploadedDate;
            updatedItem.UserId = existingItem.UserId;
            
            
            if (file != null && file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var contentType = file.ContentType;

                var imageUrl = await _blobService.UploadImageAsync(stream, fileName, contentType);
                updatedItem.ImageUrl = imageUrl;
            }
            else
            {
                // Keep existing file if not update
                updatedItem.ImageUrl = existingItem.ImageUrl; 
            }

            if (updatedItem.ExpiryDate != existingItem.ExpiryDate)
            {
                updatedItem.Percentage = CalculateExpiryPercentage(existingItem.UploadedDate, updatedItem.ExpiryDate);
            }
            else
            {
                updatedItem.Percentage = existingItem.Percentage;
            }

            var response = await _itemsContainer.ReplaceItemAsync(updatedItem, id, new PartitionKey(updatedItem.UserId));
            return response.Resource;
        }

        public async Task<bool> DeleteItem(string id, string partitionKey)
        {
            try
            {
                await _itemsContainer.DeleteItemAsync<Items>(id, new PartitionKey(partitionKey));
                return true;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return false;
            }
        }

        private double CalculateExpiryPercentage(DateTime uploadedDate, DateTime expiryDate)
        {
            var today = DateTime.UtcNow;
            var total = (expiryDate - uploadedDate).TotalMilliseconds;
            var remaining = (expiryDate - today).TotalMilliseconds;
            return total <= 0 ? 0 : Math.Clamp((remaining / total) * 100, 0, 100);
        }

        private async Task<string> GenerateNextIdForUser(string userId)
        {
            var query = _itemsContainer.GetItemQueryIterator<int>(
                new QueryDefinition("SELECT VALUE COUNT(1) FROM c WHERE c.userId = @userId")
                    .WithParameter("@userId", userId)
            );

            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                var count = response.FirstOrDefault();
                return (count + 1).ToString();
            }
            return "1";
        }

        
        private string GenerateItemId(string name, string username)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(username))
                throw new ArgumentException("Item name and username cannot be empty");

            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmssfff");
            var cleanName = name.Replace(" ", "").ToLower();
            var cleanUsername = username.Replace(" ", "").ToLower();

            return $"{cleanName}_{cleanUsername}_{timestamp}";
        }

    }
}