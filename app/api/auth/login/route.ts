import { NextResponse } from "next/server";
import { buildCognitoLoginUrl, getCognitoConfig } from "@/app/lib/helper/auth/cognitoAuth";

export async function GET() {
  const config = getCognitoConfig();
  const url = buildCognitoLoginUrl(config);

  return NextResponse.redirect(url);
}