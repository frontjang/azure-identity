import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import dotenv from "dotenv";
const ENV_KEYS = {
    tenantId: "AZURE_TENANT_ID",
    clientId: "AZURE_CLIENT_ID",
    endpoint: "PROTECTED_API_ENDPOINT"
};
const ENV_PATH = join(process.cwd(), ".env");
function parseExistingEnv() {
    if (!existsSync(ENV_PATH)) {
        return {};
    }
    try {
        return dotenv.parse(readFileSync(ENV_PATH));
    }
    catch (error) {
        console.warn("Could not parse existing .env file:", error);
        return {};
    }
}
function escapeEnvValue(value) {
    if (value === "") {
        return "";
    }
    if (/\s/.test(value) || value.includes("#") || value.includes("\"")) {
        const escaped = value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\"/g, '\\"');
        return `"${escaped}"`;
    }
    return value;
}
function writeEnv(values) {
    const orderedKeys = Object.values(ENV_KEYS);
    const contents = orderedKeys
        .map((key) => {
        const value = values[key];
        if (value == null) {
            return undefined;
        }
        return `${key}=${escapeEnvValue(value)}`;
    })
        .filter((line) => Boolean(line))
        .join("\n");
    writeFileSync(ENV_PATH, `${contents}\n`, "utf8");
}
export async function loadConfiguration() {
    dotenv.config({ path: ENV_PATH, override: false });
    const existingFileValues = parseExistingEnv();
    const configuration = {
        tenantId: process.env[ENV_KEYS.tenantId] ?? existingFileValues[ENV_KEYS.tenantId] ?? "",
        clientId: process.env[ENV_KEYS.clientId] ?? existingFileValues[ENV_KEYS.clientId] ?? "",
        endpoint: process.env[ENV_KEYS.endpoint] ?? existingFileValues[ENV_KEYS.endpoint] ?? ""
    };
    const missingKeys = Object.keys(configuration).filter((key) => !configuration[key]);
    if (missingKeys.length > 0) {
        console.log("Some configuration values are missing. They will be requested once and cached in .env.");
        const rl = createInterface({ input, output });
        try {
            for (const key of missingKeys) {
                const promptLabel = key === "tenantId"
                    ? "Enter your Azure AD tenant ID (GUID or 'common'): "
                    : key === "clientId"
                        ? "Enter your Azure AD application (client) ID: "
                        : "Enter the protected API endpoint to call: ";
                const value = (await rl.question(promptLabel)).trim();
                if (!value) {
                    throw new Error(`${key} is required.`);
                }
                configuration[key] = value;
                process.env[ENV_KEYS[key]] = value;
            }
        }
        finally {
            rl.close();
        }
        const updatedValues = {
            ...existingFileValues,
            [ENV_KEYS.tenantId]: configuration.tenantId,
            [ENV_KEYS.clientId]: configuration.clientId,
            [ENV_KEYS.endpoint]: configuration.endpoint
        };
        writeEnv(updatedValues);
    }
    return configuration;
}
