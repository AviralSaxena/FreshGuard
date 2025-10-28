# Local Configuration Setup Guide

This guide will help you set up the required local configuration files that are excluded from git for security.

## Required Local Files

### 1. iOS Firebase Configuration

**File:** `ios/GoogleService-Info.plist`

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (freshguard-2e9db)
3. Go to Project Settings → Your apps → iOS app
4. Click "Download GoogleService-Info.plist"
5. Place it in the `ios/` directory

⚠️ **IMPORTANT:** Use `GoogleService-Info.plist.example` as a reference, but download the actual file from Firebase Console.

### 2. OpenAI API Configuration

**File:** `ai-server/.env`

Create this file in the `ai-server/` directory:

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
PORT=5000
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Azure API Configuration

**File:** `src/fg.API/appsettings.json`

Copy from `src/fg.API/appsettings.example.json` and fill in:

```json
{
  "AzureAdB2C": {
    "Instance": "https://login.microsoftonline.com/tfp/",
    "ClientId": "",
    "Domain": "qualified.domain.name",
    "SignedOutCallbackPath": "/signout/B2C_1_susi",
    "SignUpSignInPolicyId": "b2c_1_susi",
    "ResetPasswordPolicyId": "b2c_1_reset",
    "EditProfilePolicyId": "b2c_1_edit_profile",
    "CallbackPath": "/signin-oidc"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",

  "CosmosDB": {
    "URI": "https://your-cosmosdb-account.documents.azure.com:443/",
    "PrimeKey": "YOUR_ACTUAL_PRIMARY_KEY",
    "PrimaryConnectionString": "YOUR_ACTUAL_CONNECTION_STRING",
    "DatabaseId": "FreshGuardDB",
    "Containers": {
      "Items": "Items",
      "Users": "Users",
      "Notifications": "Notifications"
    }
  }, 

  "BlobStorage": {
    "ConnectionString": "YOUR_ACTUAL_BLOB_CONNECTION_STRING",
    "ContainerName": {
      "Items": "items",
      "Profile": "profile"
    }
  },
  
  "Vision": {
    "Key1": "YOUR_ACTUAL_VISION_API_KEY"
  },

  "KeyVault": {
    "Name": "your-keyvault-name",
    "URI": "https://your-keyvault-name.vault.azure.net/"
  }
}
```

**File:** `src/fg.API/appsettings.Development.json`

Create this for development-specific settings:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "CosmosDB": {
    "DatabaseId": "FreshGuardDB",
    "Containers": {
      "Items": "Items",
      "Users": "Users",
      "Notifications": "Notifications"
    }
  }
}
```

## Where to Get API Keys

| Service | Get Keys From |
|---------|---------------|
| OpenAI | https://platform.openai.com/api-keys |
| Firebase/Google | https://console.firebase.google.com |
| Azure Cosmos DB | Azure Portal → Your Cosmos DB → Keys |
| Azure Blob Storage | Azure Portal → Your Storage Account → Access Keys |
| Azure Computer Vision | Azure Portal → Your Computer Vision Resource → Keys and Endpoint |

## Verification

After setting up, verify these files exist locally but are NOT staged in git:

```bash
git status
```

You should NOT see:
- `ios/GoogleService-Info.plist`
- `ai-server/.env`
- `src/fg.API/appsettings.json`
- `src/fg.API/appsettings.Development.json`

You SHOULD see only:
- `.example` files
- Regular code files

## Security Reminders

✅ **DO:**
- Keep example files updated with structure (but not real values)
- Store sensitive keys in Azure Key Vault for production
- Rotate keys regularly
- Use environment-specific configurations

❌ **DON'T:**
- Never commit files with real API keys
- Never share API keys in chat/email
- Never hardcode secrets in source code
- Never push to public repos with secrets

## Need Help?

If you accidentally commit secrets:
1. Immediately rotate the exposed keys
2. Run `cleanup-secrets.sh` to clean git history
3. Contact your team lead

