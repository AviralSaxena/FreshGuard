using fg.Infrastructure.Data.External_services.ReceiptScanner;
using Microsoft.AspNetCore.Mvc;
using fg.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/receipt")]
public class ReceiptController : ControllerBase
{
    private readonly ReceiptScannerService _scannerService;
    private readonly string _connectionString;
    private readonly string _containerName;
    private readonly ILogger<ReceiptController> _logger;

    public ReceiptController(ReceiptScannerService scannerService, IConfiguration configuration, ILogger<ReceiptController> logger)
    {
        _scannerService = scannerService ?? throw new ArgumentNullException(nameof(scannerService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        // Ensure configuration values are not null
        _connectionString = configuration["BlobStorage:ConnectionString"]
            ?? throw new InvalidOperationException("BlobStorage:ConnectionString is not set in the configuration.");
        _containerName = configuration["BlobStorage:ContainerName:Items"]
            ?? throw new InvalidOperationException("BlobStorage:ContainerName:Items is not set in the configuration.");
    }

    [HttpPost("scan")]
    public async Task<IActionResult> ScanReceipt(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            _logger.LogWarning("No file was uploaded");
            return BadRequest(new { error = "No file uploaded." });
        }

        try
        {
            _logger.LogInformation($"File received: {file.FileName}, Size: {file.Length}");

            // Process the file and extract receipt data
            var result = await _scannerService.ScanReceipt(file);

            if (result == null || result.Count == 0)
            {
                _logger.LogWarning("Failed to extract receipt data");
                return BadRequest(new { error = "Failed to extract receipt data." });
            }

            _logger.LogInformation("Successfully processed receipt");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error processing receipt: {ex.Message}");
            return StatusCode(500, new { error = "An error occurred while processing the receipt." });
        }
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadReceipt(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            _logger.LogWarning("No file was uploaded");
            return BadRequest(new { error = "No file uploaded." });
        }

        try
        {
            // Upload the file to Blob Storage and get the URL
            var blobService = new BlobService(_connectionString, _containerName);
            var url = await blobService.UploadImageAsync(file.OpenReadStream(), file.FileName, file.ContentType);

            _logger.LogInformation($"Successfully uploaded receipt: {file.FileName}");
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error uploading receipt: {ex.Message}");
            return StatusCode(500, new { error = "An error occurred while uploading the receipt." });
        }
    }
}