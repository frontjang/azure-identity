type Configuration = {
    tenantId: string;
    clientId: string;
    endpoint: string;
};
export declare function loadConfiguration(): Promise<Configuration>;
export {};
