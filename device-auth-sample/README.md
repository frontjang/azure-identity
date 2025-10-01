# Azure Device Code Authentication Sample (JavaScript)

This sample shows how to authenticate with Azure Active Directory using the Device Code flow from a Node.js application and call a protected API. The app persists the tenant ID, client ID, and API endpoint in a `.env` file so that you only provide them the first time.

## Project layout

All project assets live in the `device-auth-sample/` folder:

```
device-auth-sample/
├── package.json
├── package-lock.json
├── README.md
└── src/
    ├── api/
    │   └── apiClient.js
    ├── auth/
    │   └── authentication.js
    ├── cli.js
    ├── config.js
    └── index.js
```

## Prerequisites

- Node.js 18 or later (for built-in `fetch` support)
- An Azure AD application configured for Device Code authentication and granted access to the target API
- Linux users need the `libsecret` package installed so that the persistent token cache from `@azure/identity-cache-persistence` can work. (macOS and Windows use their native credential stores.)

## Setup

```bash
cd device-auth-sample
npm install
```

The first run will prompt for:

- **Tenant ID** – your Azure AD tenant (GUID or `common`).
- **Client ID** – the application (client) ID of your Azure AD app registration.
- **Endpoint** – the protected API endpoint to call once the token is acquired.

The provided values are saved to `device-auth-sample/.env` so subsequent runs skip the prompts. You can also populate the `.env` file manually ahead of time:

```
AZURE_TENANT_ID=<tenant>
AZURE_CLIENT_ID=<client>
PROTECTED_API_ENDPOINT=<https://example.com/api>
```

Environment variables with the same names take precedence over the `.env` file if you need to override values temporarily.

## Run the sample

```bash
npm start
```

The script derives the scope `api://<client-id>/API` from the client ID. Update the logic in `src/cli.js` if your API uses a different scope.

When authentication succeeds the script prints the access token expiration and attempts to call the configured API using the obtained token.

## Reusing the helpers

The `src/index.js` barrel file exports:

- `loadConfiguration` – loads cached configuration or prompts once and stores it in `.env`.
- `createDeviceCodeCredential` / `authenticateWithDeviceCode` – helpers for working with the Azure Identity device code credential.
- `callProtectedEndpoint` – minimal wrapper for invoking a protected API with the acquired token.

You can import these helpers into other scripts or applications as needed.
