import { NextResponse } from "next/server";
import { getPresignedUrl } from "@/app/lib/api/getPresignedUrl";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fileName = body?.fileName;

    if (!fileName || typeof fileName !== "string") {
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
