import { NextResponse } from "next/server";
import { getPresignedUrl } from "@/app/lib/api/getPresignedUrl";
import {
  getFileNameFromBody,
  parseJsonBody,
} from "@/app/lib/helper/requestHelpers";

export async function POST(req: Request) {
  try {
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
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
