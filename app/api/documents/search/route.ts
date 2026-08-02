import { NextRequest, NextResponse } from "next/server";
import { searchDocuments } from "@/app/lib/api/searchDocuments";
import {
  buildSearchResponse,
  getSearchQueryFromRequest,
} from "@/app/lib/helper/requestHelpers";

export async function GET(req: NextRequest) {
  const query = getSearchQueryFromRequest(req);

  if (!query) {
    return NextResponse.json({ documents: [] }, { status: 200 });
  }

  try {
    const documents = await searchDocuments(query);
    return NextResponse.json(buildSearchResponse(documents), { status: 200 });
  } catch (error: unknown) {
    console.error("/api/documents/search error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
