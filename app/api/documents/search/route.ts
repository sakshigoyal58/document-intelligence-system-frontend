import { NextRequest, NextResponse } from "next/server";
import { searchDocuments } from "@/app/lib/api/searchDocuments";
import { getAccessTokenFromCookies } from "@/app/lib/helper/serverRequestHelpers";
import {
  buildSearchResponse,
  getSearchQueryFromRequest,
} from "@/app/lib/helper/requestHelpers";

export async function GET(req: NextRequest) {
  const query = getSearchQueryFromRequest(req);

  if (!query) {
    return NextResponse.json({ documents: [] }, { status: 200 });
  }

  const token = await getAccessTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const documents = await searchDocuments(query);
    return NextResponse.json(buildSearchResponse(documents), { status: 200 });
  } catch (error: unknown) {
    console.error("/api/documents/search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
