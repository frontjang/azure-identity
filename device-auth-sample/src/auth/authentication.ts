import type { AccessToken } from "@azure/identity";
import { DeviceCodeCredential, useIdentityPlugin } from "@azure/identity";
import { cachePersistencePlugin } from "@azure/identity-cache-persistence";

interface DeviceCodeAuthenticationOptions {
  tenantId: string;
  clientId: string;
  cacheName?: string;
}

interface AuthenticateWithDeviceCodeOptions extends DeviceCodeAuthenticationOptions {
  scopes: string[];
}

let isPluginRegistered = false;

function ensureCachePluginRegistered(): void {
  if (!isPluginRegistered) {
    useIdentityPlugin(cachePersistencePlugin);
    isPluginRegistered = true;
  }
}

export function createDeviceCodeCredential({
  tenantId,
  clientId,
  cacheName
}: DeviceCodeAuthenticationOptions): DeviceCodeCredential {
  ensureCachePluginRegistered();

  return new DeviceCodeCredential({
    tenantId,
    clientId,
    userPromptCallback: (info) => {
      console.log("*************************************************");
      console.log("To sign in, open:", info.verificationUri);
      console.log("And enter the code:", info.userCode);
      console.log("*************************************************");
    },
    tokenCachePersistenceOptions: {
      enabled: true,
      name: cacheName ?? "device-code-cache"
    }
  });
}

export async function authenticateWithDeviceCode({
  tenantId,
  clientId,
  scopes,
  cacheName
}: AuthenticateWithDeviceCodeOptions): Promise<AccessToken> {
  const credential = createDeviceCodeCredential({ tenantId, clientId, cacheName });
  return credential.getToken(scopes);
}
