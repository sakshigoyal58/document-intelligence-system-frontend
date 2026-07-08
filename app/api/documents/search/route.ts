import { NextRequest, NextResponse } from "next/server";
import { searchDocuments } from "@/app/lib/api/searchDocuments";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("searchText")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ documents: [] }, { status: 200 });
  }

  try {
    const documents = await searchDocuments(query);
    return NextResponse.json({ documents: documents.slice(0, 10) }, { status: 200 });
  } catch (error: unknown) {
    console.error("/api/documents/search error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
