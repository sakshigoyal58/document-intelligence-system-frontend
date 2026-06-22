import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code received" }, { status: 400 });
  }

  const tokenUrl = `${process.env.COGNITO_DOMAIN}/oauth2/token`;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.COGNITO_CLIENT_ID!,
    client_secret: process.env.COGNITO_CLIENT_SECRET!,
    code,
    redirect_uri: process.env.COGNITO_REDIRECT_URI!,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const tokens = await response.json();

  const idToken = tokens.id_token;
  const accessToken = tokens.access_token;

  if (!idToken) {
    return NextResponse.json({ error: "No id_token received" }, { status: 400 });
  }

  // Decode JWT (no verification yet for simplicity)
  const decoded: any = jwt.decode(idToken);

  console.log("USER INFO:", decoded);

  const email = decoded?.email;
  const groups = decoded?.["cognito:groups"] || [];

  const role = groups.includes("Reviewer")
    ? "Reviewer"
    : "Uploader";

  // Redirect based on role
  const redirectUrl =
    role === "Reviewer"
      ? "/uploadDocuments"
      : "/reviewDocuments"; // Change to "/uploadDocuments" if you have a separate page for uploaders

  const res = NextResponse.redirect(new URL(redirectUrl, req.url));

  // Store minimal info in cookie (BFF pattern start)
  res.cookies.set("user", JSON.stringify({ email, role }), {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    path: "/",
  });

  res.cookies.set("access_token", accessToken, {
  httpOnly: true,
  secure: false, // use true in production (HTTPS)
  sameSite: "lax",
  path: "/",
});

  return res;
}