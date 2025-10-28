using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace fg.Application.DTOs
{
    public class CreateUserRequest
    {
        public required string Username { get; set; } = string.Empty;
        public required string FirstName { get; set; } = string.Empty;
        public required string LastName { get; set; } = string.Empty;
        public required string Email { get; set; } = string.Empty;
        public required string Password { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Id {get; set; } = string.Empty;
        public string? Gender { get; set; }
        public string? ImageUrl { get; set; }
        public string? Birthday { get; set; } 
        public IFormFile? File { get; set; }
    }
    public class UpdateUserRequest
    {
        public string? Username { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Gender { get; set; }
        public string? Birthday { get; set; } 
        public string? ImageUrl { get; set; }
        public IFormFile? File { get; set; }
    }
    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
     public class UpdateCountRequest
    {
        public required int Count { get; set; }
    }
    public class ChangePasswordRequest
    {
        public required string CurrentPassword { get; set; }
        public required string NewPassword { get; set; }

    }
}