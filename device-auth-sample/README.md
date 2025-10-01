# Azure Device Code Authentication Sample (TypeScript)

This sample shows how to authenticate with Azure Active Directory using the Device Code flow from a Node.js application and call a protected API. The app persists the tenant ID, client ID, and API endpoint in a `.env` file so that you only provide them the first time. The TypeScript source is compiled to JavaScript under `dist/` and checked into the repository for easy reuse.

## Project layout

All project assets live in the `device-auth-sample/` folder:

```
device-auth-sample/
├── dist/
│   ├── api/
│   │   └── apiClient.js
│   ├── auth/
│   │   └── authentication.js
│   ├── cli.js
│   ├── config.js
│   └── index.js
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── src/
    ├── api/
    │   └── apiClient.ts
    ├── auth/
    │   └── authentication.ts
    ├── cli.ts
    ├── config.ts
    └── index.ts
```

## Prerequisites

- Node.js 18 or later (for built-in `fetch` support)
- An Azure AD application configured for Device Code authentication and granted access to the target API
- Linux users need the `libsecret` package installed so that the persistent token cache from `@azure/identity-cache-persistence` can work. (macOS and Windows use their native credential stores.)

## Setup

1. Copy `.env.sample` to `.env` and fill in your tenant, client, and API details or let the CLI prompt you on first run.
2. Install dependencies and build the TypeScript source:

   ```bash
   cd device-auth-sample
   npm install
   npm run build
   ```

Environment variables with the same names take precedence over the `.env` file if you need to override values temporarily.

## Run the sample

```bash
npm start
```

The script derives the scope `api://<client-id>/API` from the client ID. Update the logic in `src/cli.ts` if your API uses a different scope.

When authentication succeeds the script prints the access token expiration and attempts to call the configured API using the obtained token.

The repository already contains the compiled `dist/` output. After running `npm install` once you can copy the entire folder—including `dist/`, the populated `.env`, and the `node_modules/` directory—to another machine and execute `npm start` without an additional build step.

## Configuration reference

`.env.sample` demonstrates the values the CLI expects:

```
AZURE_TENANT_ID=<tenant>
AZURE_CLIENT_ID=<client>
PROTECTED_API_ENDPOINT=<https://example.com/api>
```

## Reusing the helpers

The `src/index.ts` barrel file exports:

- `loadConfiguration` – loads cached configuration or prompts once and stores it in `.env`.
- `createDeviceCodeCredential` / `authenticateWithDeviceCode` – helpers for working with the Azure Identity device code credential.
- `callProtectedEndpoint` – minimal wrapper for invoking a protected API with the acquired token.

You can import these helpers into other scripts or applications as needed.
