import { NextResponse } from "next/server";
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import {
  AuthUserSession,
  CognitoConfig,
  DecodedCognitoUser,
  UserRole,
} from "@/app/types/cognitoAuthEntities";

export function getCognitoConfig(): CognitoConfig {
  return {
    domain: process.env.COGNITO_DOMAIN!,
    issuer: process.env.COGNITO_ISSUER!,
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

function assertJwtPayload(payload: unknown): payload is JwtPayload {
  return typeof payload === "object" && payload !== null;
}

async function getSigningKey(domain: string, kid: string): Promise<string> {
  const client = jwksClient({
    jwksUri: `${domain}/.well-known/jwks.json`,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600000,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
  });

  const key = await client.getSigningKey(kid);
  return key.getPublicKey();
}

export async function validateAndDecodeUserFromToken(
  idToken: string,
  config: CognitoConfig,
): Promise<DecodedCognitoUser> {
  const decoded = jwt.decode(idToken, { complete: true }) as
    | { header?: JwtHeader; payload?: JwtPayload }
    | null;

  const kid = decoded?.header?.kid;
  if (!kid) {
    throw new Error("Invalid token header");
  }

  const publicKey = await getSigningKey(config.issuer, kid);
  const verifiedPayload = jwt.verify(idToken, publicKey, {
    audience: config.clientId,
    issuer: config.issuer,
    algorithms: ["RS256"],
  }) as JwtPayload;

  if (!assertJwtPayload(verifiedPayload)) {
    throw new Error("Invalid token payload");
  }

  if (typeof verifiedPayload.email !== "string") {
    throw new Error("Token payload missing email");
  }

  return {
    email: verifiedPayload.email,
    groups: Array.isArray(verifiedPayload["cognito:groups"])
      ? verifiedPayload["cognito:groups"].filter(
          (item): item is string => typeof item === "string",
        )
      : [],
  };
}

export function resolveUserRole(groups: string[]): UserRole {
  return groups.includes("Reviewer") ? "Reviewer" : "Uploader";
}

export function getRedirectPath(role: UserRole): string {
  return role === "Reviewer" ? "/reviewDocuments" : "/uploadDocuments";
}

export function createAuthRedirectResponse(
  req: Request,
  user: AuthUserSession,
  idToken: string,
  accessToken?: string,
): NextResponse {
  const redirectUrl = new URL(getRedirectPath(user.role), req.url);
  const response = NextResponse.redirect(redirectUrl);

  const isSecure = req.url.startsWith("https://");

  response.cookies.set(
    "user",
    JSON.stringify({
      email: user.email,
      role: user.role,
    }),
    {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
    },
  );

  response.cookies.set("id_token", idToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
  });

  if (accessToken) {
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}
