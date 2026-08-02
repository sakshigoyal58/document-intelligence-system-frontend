import { CognitoTokenExchangeConfig, CognitoTokenResponse } from "@/app/types/cognitoAuthEntities";

export async function exchangeAuthorizationCode(
  code: string,
  config: CognitoTokenExchangeConfig,
): Promise<CognitoTokenResponse> {

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.redirectUri,
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error("Failed to exchange authorization code");
  }

  if (!payload.id_token || !payload.access_token) {
    throw new Error("Cognito token response missing required fields");
  }

  return {
    idToken: payload.id_token,
    accessToken: payload.access_token,
  };
}