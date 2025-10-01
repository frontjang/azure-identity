export async function callProtectedEndpoint({ endpoint, accessToken }) {
    const response = await fetch(endpoint, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const result = {
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
        }
        catch (error) {
            result.errorBody = bodyText;
        }
        return result;
    }
    if (response.ok) {
        result.data = bodyText;
    }
    else {
        result.errorBody = bodyText;
    }
    return result;
}
