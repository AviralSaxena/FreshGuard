using AutoMapper;
using fg.Application.DTOs;
using fg.Application.Interfaces;
using fg.Domain.Entities;
// using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace freshguard.Controllers
{
    [ApiController]
    [Route("api/users")]

    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UsersController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        //[Authorize] // Only Authenticated User
        [HttpGet] //Good to go
        public async Task<IActionResult> GetAllusers()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }

        [HttpGet("{userId}")] //Good to go
        public async Task<IActionResult> GetUserByUserId(string userId)
        {
            var user = await _userService.GetUserById(userId);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromForm] CreateUserRequest userRequest, IFormFile? file = null)
        {
            if (userRequest == null)
            {
                return BadRequest("User data is required.");
            }

            var userEntity = _mapper.Map<User>(userRequest);
            var createdUser = await _userService.CreateUser(userEntity, file);

            return CreatedAtAction(nameof(GetUserByUserId), new { userId = createdUser.UserId}, createdUser);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromForm] UpdateUserRequest updateRequest, IFormFile? file)
        {
            try 
            {
                var user = _mapper.Map<User>(updateRequest); 

                var updatedUser = await _userService.UpdateUser(userId, user, file); 

                if (updatedUser == null) 
                {
                    return NotFound(new { message = $"User with ID {userId} not found."}); 
                }

                return Ok(updatedUser); 
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error updating user: " + ex.Message); 
                return StatusCode(500, new { message = "An error occurred while updating teh user."}); 
            }
        }

        [HttpDelete("{userId}")] //Good to go
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var success = await _userService.DeleteUser(userId);
            if (!success)
            {
                Console.WriteLine("User not found for delete");
                return NotFound();
            }

            return NoContent();
        }

        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null)
            {
                return BadRequest("Login data is required.");
            }

            var user = await _userService.ValidateUser(loginRequest.Email, loginRequest.Password);
            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            return Ok(user);
        }

        [HttpPost("{userId}/change-password")]
        public async Task<IActionResult> ChangePassword(string userId, [FromBody] ChangePasswordRequest changePasswordRequest)
        {
            var success = await _userService.ChangePassword(userId, changePasswordRequest.CurrentPassword, changePasswordRequest.NewPassword);

            if (!success)
            {
                return BadRequest(new { message = "Invalid current password or user not found." });
            }

            return Ok(new { message = "Password changed successfully." });
        }   

        [HttpPut("{userId}/product-count")]
        
        public async Task<IActionResult> UpdateProductCount(string userId, [FromBody] UpdateCountRequest request)
        {
            Console.WriteLine("Inside product-count");
            if (request == null)
            {
                return BadRequest("Product count data is required.");
            }

            var user = await _userService.UpdateProductCount(userId, request.Count);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(User);
        }

        [HttpPut("{userId}/recipe-count")]
        public async Task<IActionResult> UpdateRecipeCount(string userId, [FromBody] UpdateCountRequest request)
        {
            if (request == null)
            {
                return BadRequest("Recipe count data is required.");
            }

            var user = await _userService.UpdateRecipeCount(userId, request.Count);
            if(user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}