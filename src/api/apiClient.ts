export interface ProtectedApiRequest {
  endpoint: string;
  accessToken: string;
}

export interface ApiCallResult<T = unknown> {
  ok: boolean;
  status: number;
  data?: T;
  errorBody?: string;
}

export async function callProtectedEndpoint<T = unknown>(request: ProtectedApiRequest): Promise<ApiCallResult<T>> {
  const response = await fetch(request.endpoint, {
    headers: {
      Authorization: `Bearer ${request.accessToken}`
    }
  });

  const result: ApiCallResult<T> = {
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
      result.data = JSON.parse(bodyText) as T;
    } catch (err) {
      result.errorBody = bodyText;
    }
    return result;
  }

  if (response.ok) {
    result.data = bodyText as unknown as T;
  } else {
    result.errorBody = bodyText;
  }

  return result;
}

