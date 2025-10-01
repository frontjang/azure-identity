import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export interface UserInput {
  tenantId: string;
  clientId: string;
  endpoint: string;
}

export async function promptForUserInput(): Promise<UserInput> {
  const rl = createInterface({ input, output });
  try {
    const tenantId = (await rl.question("Enter your Azure AD tenant ID (GUID or 'common'): ")).trim();
    const clientId = (await rl.question("Enter your Azure AD application (client) ID: ")).trim();
    const endpoint = (await rl.question("Enter the protected API endpoint to call: ")).trim();

    return { tenantId, clientId, endpoint };
  } finally {
    rl.close();
  }
}

