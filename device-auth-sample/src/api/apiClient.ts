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

export async function callProtectedEndpoint({
  endpoint,
  accessToken
}: CallProtectedEndpointOptions): Promise<ApiCallResult> {
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const result: ApiCallResult = {
    ok: response.ok,
    status: response.status
  };

  const bodyText = await response.text();
  if (!bodyText) {
    return result;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      result.data = JSON.parse(bodyText);
    } catch (error) {
      result.errorBody = bodyText;
    }
    return result;
  }

  if (response.ok) {
    result.data = bodyText;
  } else {
    result.errorBody = bodyText;
  }

  return result;
}
