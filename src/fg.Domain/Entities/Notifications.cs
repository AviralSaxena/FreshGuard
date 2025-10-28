using System;
using Newtonsoft.Json;

namespace fg.Domain.Entities
{

    public class Notifications
    {
        [JsonProperty("id")] public required string Id { get; set; }

        [JsonProperty("userId")] public required string UserId { get; set; }

        [JsonProperty("itemId")] public required string ItemId { get; set; }

        [JsonProperty("itemName")] public required string ItemName { get; set; }

        [JsonProperty("expiryDate")] public DateTime? ExpiryDate { get; set; } // Nullable to avoid errors

        [JsonProperty("notificationDate")] public DateTime NotificationDate { get; set; }

        [JsonProperty("isRead")] public bool IsRead { get; set; }

        [JsonProperty("message")] public required string Message { get; set; }

        [JsonProperty("notificationType")] public required string NotificationType { get; set; }

        // Constructor to auto-generate ID, set timestamp, and mark as unread
        public Notifications()
        {
            Id = Guid.NewGuid().ToString();
            NotificationDate = DateTime.UtcNow;
            IsRead = false;
        }
    }
}