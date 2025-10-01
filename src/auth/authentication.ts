import { DeviceCodeCredential, type DeviceCodeCredentialOptions, type AccessToken, useIdentityPlugin } from "@azure/identity";
import { cachePersistencePlugin } from "@azure/identity-cache-persistence";

let isPluginRegistered = false;

function ensureCachePluginRegistered(): void {
  if (!isPluginRegistered) {
    useIdentityPlugin(cachePersistencePlugin);
    isPluginRegistered = true;
  }
}

export interface DeviceCodeAuthConfig {
  tenantId: string;
  clientId: string;
  scopes: string[];
  cacheName?: string;
}

export function createDeviceCodeCredential(config: DeviceCodeAuthConfig): DeviceCodeCredential {
  ensureCachePluginRegistered();

  const options: DeviceCodeCredentialOptions = {
    tenantId: config.tenantId,
    clientId: config.clientId,
    userPromptCallback: (info) => {
      console.log("*************************************************");
      console.log("To sign in, open:", info.verificationUri);
      console.log("And enter the code:", info.userCode);
      console.log("*************************************************");
    },
    tokenCachePersistenceOptions: {
      enabled: true,
      name: config.cacheName ?? "device-code-cache"
    }
  };

  return new DeviceCodeCredential(options);
}

export async function authenticateWithDeviceCode(config: DeviceCodeAuthConfig): Promise<AccessToken> {
  const credential = createDeviceCodeCredential(config);
  return credential.getToken(config.scopes);
}

