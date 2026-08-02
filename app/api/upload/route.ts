import { NextResponse } from "next/server";
import { getPresignedUrl } from "@/app/lib/api/getPresignedUrl";
import {
  getAccessTokenFromCookies,
} from "@/app/lib/helper/serverRequestHelpers";
import { getFileNameFromBody, parseJsonBody } from "@/app/lib/helper/requestHelpers";

export async function POST(req: Request) {
  try {
    const token = await getAccessTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await parseJsonBody(req);
    const fileName = getFileNameFromBody(body);

    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    const data = await getPresignedUrl(fileName);
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("/api/upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
