using fg.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace fg.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User?> GetUserById(string userId);
        Task<User> CreateUser(User user, IFormFile? file = null);
        Task<User?> UpdateUser(string userId, User updatedUser, IFormFile? file = null);
        Task<bool> DeleteUser(string userId);
        Task<bool> ChangePassword(string userId, string currentPassword, string newPassword);
        Task<User?> ValidateUser(string email, string password);
        Task<User?> UpdateProductCount(string userId, int count);
        Task<User?> UpdateRecipeCount(string userId, int count);
    }
}