import { NextResponse } from "next/server";
import {
  AuthUserSession,
  CognitoConfig,
  DecodedCognitoUser,
  UserRole,
} from "@/app/types/cognitoAuthEntities";
import jwt from "jsonwebtoken";


export function getCognitoConfig(): CognitoConfig {
  return {
    domain: process.env.COGNITO_DOMAIN!,
    clientId: process.env.COGNITO_CLIENT_ID!,
    redirectUri: process.env.COGNITO_REDIRECT_URI!,
  };
}

export function buildCognitoLoginUrl(config: CognitoConfig): URL {
  const url = new URL(`${config.domain}/login`);

  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "email openid profile");
  url.searchParams.set("redirect_uri", config.redirectUri);

  return url;
}

export function buildCognitoTokenUrl(domain: string): string {
  return `${domain}/oauth2/token`;
}

export function getAuthCode(req: Request): string | null {
  return new URL(req.url).searchParams.get("code");
}

export function decodeUserFromToken(idToken: string): DecodedCognitoUser {
  const decoded = jwt.decode(idToken) as {
    email?: string;
    "cognito:groups"?: string[];
  };
  console.log(decoded);
  console.log(decoded["cognito:groups"]);

  return {
    email: decoded.email,
    groups: decoded["cognito:groups"] ?? [],
  };
}

export function resolveUserRole(groups: string[]): UserRole {
  console.log(`User groups: ${groups}`);
  return groups.includes("Reviewer") ? "Reviewer" : "Uploader";
}

export function getRedirectPath(role: UserRole): string {
  console.log(`User role: ${role}`);
  return role === "Reviewer" ? "/reviewDocuments" : "/uploadDocuments";
}

export function createAuthRedirectResponse(
  req: Request,
  user: AuthUserSession,
  accessToken: string,
): NextResponse {
  const redirectUrl = new URL(getRedirectPath(user.role), req.url);
  const response = NextResponse.redirect(redirectUrl);
  const isSecure = req.url.startsWith("https://");

  response.cookies.set(
    "user",
    JSON.stringify({ email: user.email, role: user.role }),
    {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
    },
  );

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
