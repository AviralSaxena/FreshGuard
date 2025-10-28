// Description: This file defines the User class, which represents a user in the system.
using Newtonsoft.Json; // Library to serializa and deserializa Object <-> JSON

namespace fg.Domain.Entities
{
    public class User
    {
        [JsonProperty("id")]
        public required string Id { get; set; }  
        [JsonProperty("userId")]
        public string UserId { get; set; }  
        
        [JsonProperty("username")]
        public string Username { get; set; } = string.Empty; 

        [JsonProperty("firstName")]
        public required string FirstName { get; set; }  

        [JsonProperty("lastName")]
        public required string LastName { get; set; }  

        [JsonProperty("email")]
        public required string Email { get; set; }  

        [JsonProperty("gender")]
        public string? Gender { get; set; } 

        [JsonProperty("imageUrl")]
        public string? ImageUrl { get; set; }  

        [JsonProperty("password")]
        public required string Password { get; set; }  // Store **hashed** passwords in DB 

        // [JsonProperty("keepMeLogin")]
        // public bool KeepMeLogin { get; set; }  

        [JsonProperty("returnUsers")]
        public bool ReturnUsers { get; set; }  // If first-time user, show onboarding screens
        
        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; } 
        
        [JsonProperty("birthday")]
        public string? Birthday { get; set; } // Accepts formatted string like "MM/dd/yyyy"

        
        [JsonProperty("numOfProduct")]
        public int NumOfProducts { get; set; } = 0; 
        
        [JsonProperty("numOfRecipes")]
        public int NumOfRecipes { get; set; } = 0; 

        // Constructor to auto-generate ID, timestamp, and defaults
        public User()
        {
            UserId = Guid.NewGuid().ToString();
            CreatedAt = DateTime.UtcNow;
            // KeepMeLogin = false;
            ReturnUsers = false;
        }

        public override string ToString()
        {
            return $"User [Id={Id}, UserId={UserId}, Username={Username}, " +
                   $"FirstName={FirstName}, LastName={LastName}, Email={Email}, " +
                   $"Gender={Gender}, CreatedAt={CreatedAt:yyyy-MM-dd HH:mm:ss}, " +
                   $"ImageUrl={(string.IsNullOrEmpty(ImageUrl) ? "N/A" : ImageUrl)}, " +
                   $"ReturnUsers={ReturnUsers}, " +
                   $"NumOfProducts={NumOfProducts}, NumOfRecipes={NumOfRecipes}]";
        }

    }
}