using Microsoft.AspNetCore.Http;

namespace fg.Application.DTOs
{
    public class CreateItemRequest
    {
        public string? ItemId { get; set; }
        public required string UserId { get; set; }
        public required string Category { get; set; }
        public required string Name { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.UtcNow; 
        public int Quantity { get; set; } = 1;  // Default quantity to 1
        public string? Notes { get; set; }
        public double Percentage { get; set; }
        public IFormFile? File { get; set; }
    }
    public class UpdateItemRequest
    {
        public string? Category { get; set; }
        public string? Name { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int? Quantity { get; set; }
        public string? Notes { get; set; }
        public IFormFile? File { get; set; }
    }
}