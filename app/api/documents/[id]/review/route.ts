import { NextRequest, NextResponse } from "next/server";
import { updateDocumentStatus } from "@/app/lib/api/updateDocumentStatus";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  const resolvedParams = await params;

  try {
    const body = await req.json();
    const status = body?.status;

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    // validate status value server-side (defense in depth)
    const allowed = new Set(["APPROVED", "REJECTED"]);
    if (!allowed.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // basic id validation to prevent weird input
    if (!/^[a-zA-Z0-9_-]+$/.test(resolvedParams.id)) {
      return NextResponse.json({ error: "Invalid document id" }, { status: 400 });
    }

    const message = await updateDocumentStatus(resolvedParams.id, status);

    // return plain text message from upstream
    return new NextResponse(message, { status: 200 });
  } catch (err: unknown) {
    console.error("/api/documents/[id]/review error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
