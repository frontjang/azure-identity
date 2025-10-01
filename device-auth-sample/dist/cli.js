import { authenticateWithDeviceCode } from "./auth/authentication.js";
import { callProtectedEndpoint } from "./api/apiClient.js";
import { loadConfiguration } from "./config.js";
async function run() {
    try {
        const { tenantId, clientId, endpoint } = await loadConfiguration();
        if (!tenantId || !clientId) {
            throw new Error("Tenant ID and Client ID are required to authenticate.");
        }
        if (!endpoint) {
            throw new Error("An API endpoint is required to perform the test call.");
        }
        const scopes = [`api://${clientId}/API`];
        const token = await authenticateWithDeviceCode({
            tenantId,
            clientId,
            scopes,
            cacheName: "api-demo-cache"
        });
        console.log("✅ Access token acquired");
        console.log("Expires:", new Date(token.expiresOnTimestamp).toISOString());
        const apiResult = await callProtectedEndpoint({
            endpoint,
            accessToken: token.token
        });
        if (apiResult.ok) {
            console.log("Custom API response:", apiResult.data ?? {});
        }
        else {
            console.error("API call failed:", apiResult.status, apiResult.errorBody ?? "");
        }
    }
    catch (error) {
        console.error("Error:", error);
        process.exitCode = 1;
    }
}
void run();
