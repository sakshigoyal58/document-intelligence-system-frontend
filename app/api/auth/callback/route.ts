import { NextResponse } from "next/server";
import {
  buildCognitoTokenUrl,
  createAuthRedirectResponse,
  decodeUserFromToken,
  getAuthCode,
  getCognitoConfig,
  resolveUserRole,
} from "@/app/lib/helper/auth/cognitoAuth";
import { exchangeAuthorizationCode } from "@/app/lib/api/getCognitoToken";

export async function GET(req: Request) {
  const code = getAuthCode(req);

  if (!code) {
    return NextResponse.json({ error: "No code received" }, { status: 400 });
  }

  const config = getCognitoConfig();
  const tokenUrl = buildCognitoTokenUrl(config.domain);
  const tokens = await exchangeAuthorizationCode(code, {
    tokenUrl,
    clientId: config.clientId,
    clientSecret: process.env.COGNITO_CLIENT_SECRET!,
    redirectUri: config.redirectUri,
  });

  const idToken = tokens.idToken;

  if (!idToken) {
    return NextResponse.json({ error: "No id_token received" }, { status: 400 });
  }

  const decodedUser = decodeUserFromToken(idToken);
  console.log(decodedUser);
  const role = resolveUserRole(decodedUser.groups);

  return createAuthRedirectResponse(
    req,
    {
      email: decodedUser.email,
      role,
    },
    tokens.accessToken ?? "",
  );
}