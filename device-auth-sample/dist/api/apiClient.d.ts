export interface CallProtectedEndpointOptions {
    endpoint: string;
    accessToken: string;
}
export interface ApiCallResult {
    ok: boolean;
    status: number;
    data?: unknown;
    errorBody?: string;
}
export declare function callProtectedEndpoint({ endpoint, accessToken }: CallProtectedEndpointOptions): Promise<ApiCallResult>;
