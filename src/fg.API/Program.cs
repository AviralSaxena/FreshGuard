using fg.Infrastructure.Data;
using fg.Application.Interfaces;
using fg.Application.Services;
using Microsoft.Azure.Cosmos;
using Azure.Identity;
using fg.Infrastructure.Services;
using fg.Infrastructure.Data.External_services.ReceiptScanner;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to listen on port 5241
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5241);
    options.ListenLocalhost(5241);
});

// Load configuration
var configuration = builder.Configuration;

//-----------------------------------------Retrieve Key Vault secrets-----------------------------------------
// Create Key Vault reference for access
string? keyVaultName = configuration["KeyVault:Name"];
if (string.IsNullOrEmpty(keyVaultName))
{
    throw new InvalidOperationException("config variable 'KeyVault:Name' is not set.");
}

if (!builder.Environment.IsDevelopment())
{
    var keyVaultUri = new Uri($"https://{keyVaultName}.vault.azure.net/");
    builder.Configuration.AddAzureKeyVault(keyVaultUri, new DefaultAzureCredential());
}

//-----------------------------------------Retrieve DB and blob storage context from config-----------------------------------------

// Retrieve Cosmos DB configuration
var endpointUri = configuration["CosmosDB:URI"];
var primaryKey = configuration["CosmosDB:PrimeKey"];
var primeConnectionString = configuration["CosmosDB:PrimaryConnectionString"];
var databaseId = configuration["CosmosDB:DatabaseId"];

var itemsContainerName = configuration["CosmosDB:Containers:Items"];
var usersContainerName = configuration["CosmosDB:Containers:Users"];
var notificationContainerName = configuration["CosmosDB:Containers:Notifications"];

var visionApiKey = configuration["Vision:Key1"];

// Retrieve Blob Storage configuration
var blobConnectionString = configuration["BlobStorage:ConnectionString"];
var itemsBlobContainerName = configuration["BlobStorage:ContainerName:Items"];
var profileBlobContainerName = configuration["BlobStorage:ContainerName:Profile"];

// Validate Cosmos DB and Blob Storage configuration
if (string.IsNullOrEmpty(endpointUri) || string.IsNullOrEmpty(primaryKey) || string.IsNullOrEmpty(databaseId) ||
    string.IsNullOrEmpty(itemsContainerName) || string.IsNullOrEmpty(usersContainerName) ||
    string.IsNullOrEmpty(blobConnectionString) || string.IsNullOrEmpty(itemsBlobContainerName) || 
    string.IsNullOrEmpty(profileBlobContainerName) || string.IsNullOrEmpty(notificationContainerName) ||
    string.IsNullOrEmpty(visionApiKey))
{
    throw new ArgumentNullException("Configuration values are missing! Check appsettings.json.");
}



// Register Cosmos DB and Blob Storage
builder.Services.AddSingleton<CosmosClient>(_ => new CosmosClient(endpointUri, primaryKey));
builder.Services.AddSingleton<AppDbContext>(provider =>
{
    return new AppDbContext(configuration, endpointUri, primaryKey, databaseId,
        itemsContainerName, usersContainerName, notificationContainerName, blobConnectionString, 
        itemsBlobContainerName, profileBlobContainerName, visionApiKey);
});
builder.Services.AddSingleton<CosmosDbService>();
builder.Services.AddScoped<ReceiptScannerService>(); 
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddScoped<IUserService, UserService>();

// Enable CORS for frontend access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// Mapping between DTOs and Domain Models
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Register controllers
builder.Services.AddControllers();

// Build the app
var app = builder.Build();

// Enable CORS
app.UseCors("AllowAll");

// Map controllers
app.MapControllers();
app.MapGet("/debug", () => "✅ API is up");

// Run the app
app.Run();