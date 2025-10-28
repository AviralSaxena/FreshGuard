using Microsoft.Azure.Cosmos;
using fg.Domain.Entities;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace fg.Infrastructure.Services
{
    public class CosmosDbService
    {
        
        private readonly CosmosClient _cosmosClient;
        private readonly Container _itemsContainer;
        private readonly Container _usersContainer;
        private readonly Container _notificationsContainer;
        private readonly string? _databaseId;
        private readonly IConfiguration? _configuration;
        

        public CosmosDbService(string endpointUri, string primaryKey, string databaseId
        , string itemsContainerName, string usersContainerName, string connectionString
        , string notificationsContainerName)
        {

            _cosmosClient = new CosmosClient(endpointUri, primaryKey);
            _databaseId = databaseId;
            _itemsContainer = _cosmosClient.GetContainer(databaseId, itemsContainerName);
            _usersContainer = _cosmosClient.GetContainer(databaseId, usersContainerName);
            _notificationsContainer = _cosmosClient.GetContainer(databaseId, notificationsContainerName);
            _configuration = new ConfigurationBuilder().Build();
        }

        public CosmosDbService(CosmosClient cosmosClient, IConfiguration configuration)
        {
            _cosmosClient = cosmosClient;
            _configuration = configuration;
            _itemsContainer = _cosmosClient.GetContainer(configuration["CosmosDB:DatabaseId"], configuration["CosmosDB:Containers:Items"]);
            _usersContainer = _cosmosClient.GetContainer(configuration["CosmosDB:DatabaseId"], configuration["CosmosDB:Containers:Users"]);
            _notificationsContainer = _cosmosClient.GetContainer(configuration["CosmosDB:DatabaseId"], configuration["CosmosDB:Containers:Notifications"]);
        }
        

        
        
        //Get container
        private Container GetContainer(string containerKey)
        {
            // string containerName = _configuration[$"CosmosDB:Containers:{containerKey}"] 
            //     ?? throw new KeyNotFoundException($"CosmosDB configuration key missing: CosmosDB:Containers:{containerKey}");

            if (_configuration == null)
                throw new InvalidOperationException("Configuration is not initialized.");

            string containerName = _configuration[$"CosmosDB:Containers:{containerKey}"] 
                ?? throw new KeyNotFoundException($"CosmosDB config missing: CosmosDB:Containers:{containerKey}");

            
            return _cosmosClient.GetContainer(_databaseId, containerName);
        }

        /*
         * Get item by Id
         *
         * Example use: await cosmosDbService.GetItemAsync<User>("Users", userId);
         */
        public async Task<T?> GetItemAsyncv2<T>(string containerKey, string id) where T : class
        {
            var container = GetContainer(containerKey);
            try
            {
                return (await container.ReadItemAsync<T>(id, new PartitionKey(id)))?.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                Console.WriteLine($"Item with id {id} not found");
                return null;
            }
        }

        /*
         * Get item by query
         *
         * Example use: var items = await itemsService.QueryItemsAsync<Item>(
         * "Items",
           "SELECT * FROM c WHERE c.ownerId = 'user123'");
            
            
            Note: Maybe add Pagination later
         */
        
        public async Task<List<T>> QueryItemsAsync2<T>(string containerKey, string queryString) where T : class
        {
            var container = GetContainer(containerKey);
            var query = container.GetItemQueryIterator<T>(new QueryDefinition(queryString));
            var results = new List<T>();

            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response);
            }
            return results;
        }
        
        /*
         * Add item
         *
         * Example Use:
         * await cosmosDbService.AddItemAsync("Users", newUser, newUser.Id);
         */

        public Task AddItemAsyncv2<T>(string containerKey, T item, string partitionKey) where T : class
        {
            var container = GetContainer(containerKey);
            return container.CreateItemAsync<T>(item, new PartitionKey(partitionKey));
        }
        
        
        /*
         * Delete item
         *
         *Example Use:
         * await itemsService.DeleteItemAsync("Users", "item123");
         */

        public async Task DeleteItemAsyncv2<T>(string containerKey, string id) where T : class
        {
            var container = GetContainer(containerKey);
            await container.DeleteItemAsync<T>(id, new PartitionKey(id));
        }
        
        
        /*
         * Update item
         *
         * Example Use:
         * var updatedItem = new Item { Id = "item123", Name = "Updated Name", OwnerId = "user1" };
           await cosmosDbService.UpdateItemAsync<Item>("Items", "item123", updatedItem);
           
           ReplaceItemAsync() replaces the entire document, not just part of it.
         */

        public async Task<T?> UpdateItemAsyncv2<T>(string containerKey, string id, T item) where T : class
        {
            try
            {
                var container = GetContainer(containerKey);
                ItemResponse<T> response = await container.ReplaceItemAsync(item, id, new PartitionKey(id));

                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                Console.WriteLine($"Item with id {id} not found");
                return null;
            }
        }

    }
}
