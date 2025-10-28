// Description: This file defines the Item class, which represents a item in the system.
using Newtonsoft.Json; // Library to serialize and deserialize Object <-> JSON

namespace fg.Domain.Entities
{
    public class Items
    {
        [JsonProperty("id")]
        public required string Id { get; set; }  // Auto-generated Guid ID

        [JsonProperty("itemId")]
        public required string ItemId { get; set; }  // Unique Item Identifier

        [JsonProperty("userId")]
        public required string UserId { get; set; }  // Reference to the User

        [JsonProperty("category")]
        public required string Category { get; set; }  // Item Category

        [JsonProperty("name")]
        public required string Name { get; set; }  // Item Name

        [JsonProperty("imageUrl")]
        public string? ImageUrl { get; set; }  // Optional Image URL

        [JsonProperty("expiryDate")]
        public required DateTime ExpiryDate { get; set; }  // Expiry Date

        [JsonProperty("uploadedAt")]
        public DateTime UploadedDate { get; set; }  // Auto-generated Timestamp

        [JsonProperty("quantity")]
        public int Quantity { get; set; } = 1;  // Optional, default to 1

        [JsonProperty("notes")]
        public string? Notes { get; set; }  // Percentage remaining for the food
        [JsonProperty("percentage")]
        public double Percentage { get; set; } 
        

        // Constructor to auto-generate ID, timestamp, and defaults
        public Items()
        {
            Id = Guid.NewGuid().ToString();  // Generate unique GUID
            UploadedDate = DateTime.UtcNow;  // Auto-set current timestamp
        }
    }
}
