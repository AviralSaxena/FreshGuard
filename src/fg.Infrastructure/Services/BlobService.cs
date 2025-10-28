using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System;
using System.IO;
using Azure.Identity;

namespace fg.Infrastructure.Services
{
    public class BlobService
    {
        private readonly BlobContainerClient _containerClient;

        public BlobService(string connectionString, string containerName)
        {
            var serviceClient = new BlobServiceClient(connectionString);
            _containerClient = serviceClient.GetBlobContainerClient(containerName); 
            _containerClient.CreateIfNotExists(PublicAccessType.Blob); 
        }

        // Upload an image to Blob Storage
        public async Task<string> UploadImageAsync(Stream stream, string fileName, string contentType)
        {
            var blobClient = _containerClient.GetBlobClient(fileName); 
            var headers = new BlobHttpHeaders { ContentType = contentType }; 

            await blobClient.UploadAsync(stream, new BlobUploadOptions { HttpHeaders = headers }); 

            Console.WriteLine($"[BlobService] Uploading: {fileName}, type: {contentType}");

            if (stream == null || stream.Length == 0)
            {
                Console.WriteLine("Invalid stream. Upload aborted.");
                return "";
            }

            Console.WriteLine($"[BlobService] Uploading {fileName} ({contentType})...");

            return blobClient.Uri.ToString(); 
        }
    }
}
