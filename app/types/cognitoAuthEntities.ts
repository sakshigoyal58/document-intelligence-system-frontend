export type UserRole = "Reviewer" | "Uploader";

export interface AuthUserSession {
  email?: string;
  role: UserRole;
}

export interface CognitoConfig {
  domain: string;
  issuer: string;
  clientId: string;
  redirectUri: string;
}

export interface CognitoTokenExchangeConfig {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface CognitoTokenResponse {
  idToken?: string;
  accessToken?: string;
}

export interface DecodedCognitoUser {
  email?: string;
  groups: string[];
}