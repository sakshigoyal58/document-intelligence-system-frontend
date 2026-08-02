import { createAuthHeaders, createJsonHeaders } from "@/app/lib/helper/requestHelpers";
import { getAccessTokenFromCookies } from "@/app/lib/helper/serverRequestHelpers";

export async function getAuthorizedHeaders(
  json = true,
  token?: string,
): Promise<HeadersInit> {
  const accessToken = token ?? (await getAccessTokenFromCookies());

  if (!accessToken) {
    throw new Error("Missing access token");
  }

  return json ? createJsonHeaders(accessToken) : createAuthHeaders(accessToken);
}
