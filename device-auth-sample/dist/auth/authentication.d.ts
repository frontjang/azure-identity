import type { AccessToken } from "@azure/identity";
import { DeviceCodeCredential } from "@azure/identity";
interface DeviceCodeAuthenticationOptions {
    tenantId: string;
    clientId: string;
    cacheName?: string;
}
interface AuthenticateWithDeviceCodeOptions extends DeviceCodeAuthenticationOptions {
    scopes: string[];
}
export declare function createDeviceCodeCredential({ tenantId, clientId, cacheName }: DeviceCodeAuthenticationOptions): DeviceCodeCredential;
export declare function authenticateWithDeviceCode({ tenantId, clientId, scopes, cacheName }: AuthenticateWithDeviceCodeOptions): Promise<AccessToken>;
export {};
