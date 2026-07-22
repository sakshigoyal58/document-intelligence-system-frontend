import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { askDocumentQuestion } from "@/app/lib/api/askDocumentQuestion";

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

    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(documentId)) {
      return NextResponse.json({ error: "Invalid document id" }, { status: 400 });
    }

    const answer = await askDocumentQuestion(documentId, question, token);
    return NextResponse.json({ answer }, { status: 200 });
  } catch (error: unknown) {
    console.error("/api/documents/[id]/ask error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
