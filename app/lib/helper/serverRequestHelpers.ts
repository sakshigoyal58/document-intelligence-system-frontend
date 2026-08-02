import { cookies } from "next/headers";
import type { AuthUserSession } from "@/app/types/cognitoAuthEntities";

export async function getAccessTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function getUserSessionFromCookies(): Promise<AuthUserSession | undefined> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("user")?.value;

  if (!cookieValue) {
    return undefined;
  }

  try {
    return JSON.parse(cookieValue) as AuthUserSession;
  } catch {
    return undefined;
  }
}
