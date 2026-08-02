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

  return {
    idToken: payload.id_token,
    accessToken: payload.access_token,
  };
}