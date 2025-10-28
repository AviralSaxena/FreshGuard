using AutoMapper;
using fg.Application.DTOs;
using fg.Application.Interfaces;
using fg.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace freshguard.Controllers
{
    [ApiController]
    [Route("api/items")]
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _itemService;
        private readonly IMapper _mapper;

        public ItemsController(IItemService itemService, IMapper mapper)
        {
            _itemService = itemService;
            _mapper = mapper;
        }

        [HttpGet] 
        public async Task<IActionResult> GetAllItems()
        {
            var items = await _itemService.GetAllItems();
            return Ok(items);
        }

        [HttpGet("{id}/{partitionKey}")]
        public async Task<IActionResult> GetItemById(string id, string partitionKey)
        {
            var item = await _itemService.GetItemById(id, partitionKey);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetItemByUserId(string userId)
        {
            var items = await _itemService.GetItemByUserId(userId);
            // if (items == null || items.Count == 0) 
            //     return NotFound();
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> CreateItem([FromForm] CreateItemRequest itemRequest, IFormFile? file = null)
        {
            if (itemRequest == null)
                return BadRequest("Item data is required.");

            var itemEntity = _mapper.Map<Items>(itemRequest);
            var createdItem = await _itemService.CreateItem(itemEntity, file);

            return CreatedAtAction(nameof(GetItemById), new { id = createdItem.Id, partitionKey = createdItem.UserId }, createdItem);
        }


        [HttpPut("{id}/{partitionKey}")]
        public async Task<IActionResult> UpdateItem(string id, string partitionKey, [FromForm] UpdateItemRequest updateRequest, IFormFile? file = null)
        {
            if (updateRequest == null)
                return BadRequest("Item data is required.");

            var updatedItemEntity = _mapper.Map<Items>(updateRequest);
            
            var updatedItem = await _itemService.UpdateItem(id, partitionKey, updatedItemEntity, file); 

            if (updatedItem == null) 
                return NotFound(); 

            return Ok(updatedItem); 
        }

        [HttpDelete("{id}/{partitionKey}")]
        public async Task<IActionResult> DeleteItem(string id, string partitionKey)
        {
            var success = await _itemService.DeleteItem(id, partitionKey);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
