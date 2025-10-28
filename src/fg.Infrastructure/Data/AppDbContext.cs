using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using fg.Infrastructure.Services;

namespace fg.Infrastructure.Data
{
    public class AppDbContext
    {
        private readonly CosmosClient _cosmosClient;
        private readonly string _databaseId;
        private readonly Container _itemsContainer;
        private readonly Container _usersContainer;
        private readonly Container _notificationsContainer;
        private readonly BlobService _itemBlobService;
        private readonly BlobService _userBlobService;
        private readonly CosmosDbService _cosmosDbService;
        private readonly string _visionApiKey;

        public AppDbContext(
            IConfiguration cosmosConfig,
            string endpointUri,
            string primaryKey,
            string databaseId,
            string itemsContainerName,
            string usersContainerName,
            string notificationContainerName,
            string blobConnectionString,
            string itemsBlobContainerName,
            string profileBlobContainerName,
            string visionApiKey)
        {
            _cosmosClient = new CosmosClient(endpointUri, primaryKey);
            _databaseId = databaseId;

            _itemsContainer = _cosmosClient.GetContainer(databaseId, itemsContainerName);
            _usersContainer = _cosmosClient.GetContainer(databaseId, usersContainerName);
            _notificationsContainer = _cosmosClient.GetContainer(databaseId, notificationContainerName);

            _itemBlobService = new BlobService(blobConnectionString, itemsBlobContainerName);
            _userBlobService = new BlobService(blobConnectionString, profileBlobContainerName);

            _cosmosDbService = new CosmosDbService(_cosmosClient, cosmosConfig);

            _visionApiKey = visionApiKey;
        }

        public Container ItemsContainer => _itemsContainer;
        public Container UsersContainer => _usersContainer;
        public Container NotificationsContainer => _notificationsContainer;

        public BlobService ItemBlobService => _itemBlobService;
        public BlobService UserBlobService => _userBlobService;
        public string VisionApiKey => _visionApiKey;
    }
}
