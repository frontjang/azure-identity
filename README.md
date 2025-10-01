# Azure Device Code Authentication Sample

This project demonstrates how to authenticate with Azure Active Directory using the Device Code flow and call a protected API from Node.js/TypeScript. The code is modular so that the authentication helpers can be reused in other applications.

## Prerequisites

- Node.js 18 or later (for built-in `fetch` support)
- An Azure AD application configured for Device Code authentication and granted access to the target API

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Compile the TypeScript project (optional – `npm start` runs the sources directly):

   ```bash
   npm run build
   ```

3. Run the interactive sample:

   ```bash
   npm start
   ```

   You will be prompted for:

   - **Tenant ID** – your Azure AD tenant (GUID or `common`).
   - **Client ID** – the application (client) ID of your Azure AD app registration.
   - **Endpoint** – the protected API endpoint to call once the token is acquired.

   The script derives the scope `api://<client-id>/API` from the provided client ID. Update the scope in `src/cli.ts` if your API uses a different scope.

## Reusing the Modules

The package exports helper functions to create a `DeviceCodeCredential`, perform the authentication, and call a protected API. You can import them in your own code as follows:

```ts
import { authenticateWithDeviceCode, callProtectedEndpoint } from "./dist"; // or from "src" during development
```

See `src/index.ts` for the full list of exports.

## Token Cache

Persistent token caching is enabled through `@azure/identity-cache-persistence`. Tokens are cached under the name `api-demo-cache` by default. You can customise the cache name by setting the `cacheName` property when calling `authenticateWithDeviceCode`.

