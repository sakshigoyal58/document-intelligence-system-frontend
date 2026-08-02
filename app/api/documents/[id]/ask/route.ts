import { NextRequest, NextResponse } from "next/server";
import { askDocumentQuestion } from "@/app/lib/api/askDocumentQuestion";
import { getAccessTokenFromCookies, getUserSessionFromCookies } from "@/app/lib/helper/serverRequestHelpers";
import { isValidDocumentId } from "@/app/lib/helper/requestHelpers";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  const resolvedParams = await params;

  try {
    const body = (await req.json()) as { documentId?: unknown; question?: unknown };
    const documentId =
      typeof body?.documentId === "string" && body.documentId.trim().length > 0
        ? body.documentId.trim()
        : resolvedParams.id;
    const question = typeof body?.question === "string" ? body.question.trim() : "";

    if (!question) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    const user = await getUserSessionFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isValidDocumentId(documentId)) {
      return NextResponse.json({ error: "Invalid document id" }, { status: 400 });
    }

    const accessToken = await getAccessTokenFromCookies();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const answer = await askDocumentQuestion(documentId, question, accessToken);
    return NextResponse.json({ answer }, { status: 200 });
  } catch (error: unknown) {
    console.error("/api/documents/[id]/ask error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
