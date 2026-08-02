import {
  createAuthHeaders,
  createJsonHeaders,
  getAccessTokenFromCookies,
  parseJsonResponse,
  parseTextResponse,
} from "@/app/lib/helper/requestHelpers";

export type FetchFn = typeof fetch;

export async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit = {},
  timeoutMs = 10000,
  fetchFn: FetchFn = fetch,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  if (init.signal) {
    init.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    return await fetchFn(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function requestJson<T>(
  input: RequestInfo,
  init: RequestInit = {},
  errorMessage: string,
  timeoutMs = 10000,
  fetchFn: FetchFn = fetch,
): Promise<T> {
  const response = await fetchWithTimeout(input, init, timeoutMs, fetchFn);
  return parseJsonResponse<T>(response, errorMessage);
}

export async function requestText(
  input: RequestInfo,
  init: RequestInit = {},
  errorMessage: string,
  timeoutMs = 10000,
  fetchFn: FetchFn = fetch,
): Promise<string> {
  const response = await fetchWithTimeout(input, init, timeoutMs, fetchFn);
  return parseTextResponse(response, errorMessage);
}

export async function getAuthorizedHeaders(
  json = true,
  token?: string,
): Promise<HeadersInit> {
  const accessToken = token ?? (await getAccessTokenFromCookies());

  return json ? createJsonHeaders(accessToken) : createAuthHeaders(accessToken);
}
