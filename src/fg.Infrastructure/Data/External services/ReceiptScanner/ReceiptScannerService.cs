using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace fg.Infrastructure.Data.External_services.ReceiptScanner
{
    public class ReceiptScannerService
    {
        private readonly string _endpoint = "https://receiptscan-fg.cognitiveservices.azure.com/formrecognizer";
        private readonly string _visionApiKey;

        public ReceiptScannerService(AppDbContext dbContext)
        {
            _visionApiKey = dbContext.VisionApiKey;
        }

        public async Task<Dictionary<string, string>> ScanReceipt(IFormFile file)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", _visionApiKey);

            var requestUrl = $"{_endpoint}/documentModels/prebuilt-receipt:analyze?api-version=2024-02-01";

            using var content = new StreamContent(file.OpenReadStream());
            content.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

            var response = await client.PostAsync(requestUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Azure Vision API error: {response.StatusCode}. Details: {errorContent}");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<JsonElement>(jsonResponse);

            var receiptData = new Dictionary<string, string>();
            if (result.TryGetProperty("documents", out var documents) && documents.GetArrayLength() > 0)
            {
                var document = documents[0];
                if (document.TryGetProperty("fields", out var fields))
                {
                    receiptData["Store"] = fields.GetProperty("MerchantName").GetProperty("content").GetString() ?? "Unknown";
                    receiptData["Date"] = fields.GetProperty("TransactionDate").GetProperty("content").GetString() ?? "Unknown";
                    receiptData["Total"] = fields.GetProperty("Total").GetProperty("content").GetString() ?? "Unknown";
                }
            }

            return receiptData;
        }
    }
}