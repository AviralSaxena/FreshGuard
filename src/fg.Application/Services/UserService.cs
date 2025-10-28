using fg.Application.Interfaces;
using fg.Infrastructure.Data;
using fg.Infrastructure.Services;
using Microsoft.Azure.Cosmos;
using System.Security.Cryptography;
using System.Text;
using User = fg.Domain.Entities.User;
using Microsoft.AspNetCore.Http;
using BCrypt.Net;

namespace fg.Application.Services
{
    public class UserService : IUserService
    {
        private readonly Container _usersContainer;
        private readonly BlobService _blobService;

        public UserService(AppDbContext dbContext)
        {
            _usersContainer = dbContext.UsersContainer;
            _blobService = dbContext.UserBlobService;
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            var query = _usersContainer.GetItemQueryIterator<User>("SELECT * FROM c");
            var results = new List<User>();

            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response);
            }
            return results;
        }

        public async Task<User?> GetUserById(string userId)
        {
            try
            {
                var query = _usersContainer.GetItemQueryIterator<User>(
                    new QueryDefinition("SELECT * FROM c WHERE c.userId = @userId")
                    .WithParameter("@userId", userId));

                while (query.HasMoreResults)
                {
                    var response = await query.ReadNextAsync();
                    var user = response.FirstOrDefault();
                    if (user != null)
                    {
                        return user;
                    }
                }
                return null;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<User> CreateUser(User user, IFormFile? file = null)
        {
            var query = _usersContainer.GetItemQueryIterator<User>(
                new QueryDefinition("SELECT * FROM c WHERE c.email = @email")
                .WithParameter("@email", user.Email));

            var results = new List<User>();

            while (query.HasMoreResults)
            {
                var queryresponse = await query.ReadNextAsync();
                results.AddRange(queryresponse);
            }

            if (results.Count > 0)
            {
                throw new ApplicationException("Email already exists");
            }

            user.Password = HashPassword(user.Password);

            if (file != null && file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var contentType = file.ContentType;
                var imageUrl = await _blobService.UploadImageAsync(stream, fileName, contentType);
                user.ImageUrl = imageUrl;
            }
            else
            {
                var random = new Random();
                int index = random.Next(DefaultProfileImages.Length);
                user.ImageUrl = DefaultProfileImages[index];
            }

            user.Username = await GeneratedUniqueUsername(user.FirstName, user.LastName);
            user.UserId = user.Username;
            user.Id = await GenerateNextUserId();

            var response = await _usersContainer.CreateItemAsync(user, new PartitionKey(user.UserId));
            return response.Resource;
        }

        public async Task<User?> UpdateUser(string userId, User updatedUser, IFormFile? file = null)
        {
            var existingUser = await GetUserById(userId);
            if (existingUser == null)
            {
                Console.WriteLine("Existing user is null");
                return null;
            }

            updatedUser.Id = existingUser.Id;
            updatedUser.UserId = existingUser.UserId;
            updatedUser.CreatedAt = existingUser.CreatedAt;
            updatedUser.Password = existingUser.Password;

            updatedUser.FirstName = string.IsNullOrWhiteSpace(updatedUser.FirstName) ? existingUser.FirstName : updatedUser.FirstName;
            updatedUser.LastName = string.IsNullOrWhiteSpace(updatedUser.LastName) ? existingUser.LastName : updatedUser.LastName;
            updatedUser.Email = string.IsNullOrWhiteSpace(updatedUser.Email) ? existingUser.Email : updatedUser.Email;
            updatedUser.Gender = string.IsNullOrWhiteSpace(updatedUser.Gender) ? existingUser.Gender : updatedUser.Gender;
            updatedUser.Username = string.IsNullOrWhiteSpace(updatedUser.Username) ? existingUser.Username : updatedUser.Username;
            updatedUser.Birthday = string.IsNullOrWhiteSpace(updatedUser.Birthday) ? existingUser.Birthday : updatedUser.Birthday;

            if (file != null && file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var contentType = file.ContentType;
                var imageUrl = await _blobService.UploadImageAsync(stream, fileName, contentType);
                updatedUser.ImageUrl = imageUrl;
            }
            else
            {
                updatedUser.ImageUrl = existingUser.ImageUrl;
            }

            updatedUser.NumOfProducts = existingUser.NumOfProducts;
            updatedUser.NumOfRecipes = existingUser.NumOfRecipes;

            var response = await _usersContainer.ReplaceItemAsync(updatedUser, updatedUser.Id, new PartitionKey(updatedUser.UserId));
            return response.Resource;
        }

        public async Task<bool> DeleteUser(string userId)
        {
            var existingUser = await GetUserById(userId);
            if (existingUser == null)
            {
                return false;
            }

            await _usersContainer.DeleteItemAsync<User>(existingUser.Id, new PartitionKey(existingUser.UserId));
            return true;
        }
        public async Task<bool> ChangePassword(string userId, string currentPassword, string newPassword)
        {
            Console.WriteLine($"HIT ChangePassword for {userId}");
            var existingUser = await GetUserById(userId);

            if (existingUser == null) return false; 

            if (!VerifyPassword(currentPassword, existingUser.Password)) return false; 

            existingUser.Password = HashPassword(newPassword); 
            await _usersContainer.ReplaceItemAsync(existingUser, existingUser.Id, new PartitionKey(existingUser.UserId));
            return true; 
        }

        public async Task<User?> ValidateUser(string email, string password)
        {
            var query = _usersContainer.GetItemQueryIterator<User>(
                new QueryDefinition("SELECT * FROM c WHERE c.email = @email")
                .WithParameter("@email", email));

            User? user = null;
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                user = response.FirstOrDefault();
                if (user != null)
                {
                    break;
                }
            }

            if (user == null || !VerifyPassword(password, user.Password))
            {
                return null;
            }

            return user;
        }

        public async Task<User?> UpdateProductCount(string userId, int count)
        {
            var user = await GetUserById(userId);
            if (user == null)
            {
                return null;
            }

            user.NumOfProducts = count;
            var response = await _usersContainer.ReplaceItemAsync(user, user.Id, new PartitionKey(user.UserId));
            return response.Resource;
        }

        public async Task<User?> UpdateRecipeCount(string userId, int count)
        {
            var user = await GetUserById(userId);
            if (user == null)
            {
                return null;
            }

            user.NumOfRecipes = count;
            var response = await _usersContainer.ReplaceItemAsync(user, user.Id, new PartitionKey(user.UserId));
            return response.Resource;
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
            }
            catch (BCrypt.Net.SaltParseException)
            {
                // Fallback: check old SHA-256 hash
                var legacyHash = Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(password)));
                return legacyHash == hashedPassword;
            }
        }

        private async Task<string> GeneratedUniqueUsername(string fName, string lName)
        {
            string username;
            bool isUnique = false;

            var query = _usersContainer.GetItemQueryIterator<User>("SELECT c.username FROM c");
            var usernameSet = new HashSet<string>();

            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                foreach (var u in response)
                {
                    if (!string.IsNullOrWhiteSpace(u.Username))
                        usernameSet.Add(u.Username.ToLower());
                }
            }

            do
            {
                var random = new Random().Next(1000, 9999);
                username = $"{fName.ToLower()}{lName.ToLower()}{random}";
                if (!usernameSet.Contains(username))
                    isUnique = true;
            } while (!isUnique);

            return username;
        }

        private async Task<string> GenerateNextUserId()
        {
            var query = _usersContainer.GetItemQueryIterator<string>(
                new QueryDefinition("SELECT VALUE c.id FROM c ORDER BY c.id DESC")
            );

            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                var lastId = response.FirstOrDefault();
                if (int.TryParse(lastId, out int lastInt))
                {
                    return (lastInt + 1).ToString();
                }
            }

            return "1";
        }

        public static readonly string[] DefaultProfileImages = new[]
        {
            "https://fgcredentialsabc.blob.core.windows.net/defaultprofile/b1.png",
            "https://fgcredentialsabc.blob.core.windows.net/defaultprofile/b2.png",
            "https://fgcredentialsabc.blob.core.windows.net/defaultprofile/b3.png",
            "https://fgcredentialsabc.blob.core.windows.net/defaultprofile/b4.png",
            "https://fgcredentialsabc.blob.core.windows.net/defaultprofile/b5.png",
            "https://fgcredentialsabc.blob.core.windows.net/defaultprofile/g1.png",
            "https://fgcredentialsabc.blob.core.windows.net/defaultprofile/g2.png",
            "https://fgcredentialsabc.blob.core.windows.net/defaultprofile/g3.png",
            "https://fgcredentialsabc.blob.core.windows.net/defaultprofile/g4.png",
            "https://fgcredentialsabc.blob.core.windows.net/defaultprofile/g5.png",
        };
    }
}
