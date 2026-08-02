import { NextRequest, NextResponse } from "next/server";
import { updateDocumentStatus } from "@/app/lib/api/updateDocumentStatus";
import {
  getReviewStatusFromBody,
  isValidDocumentId,
  isValidReviewStatus,
} from "@/app/lib/helper/requestHelpers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  const resolvedParams = await params;

  try {
    const body = await req.json();
    const status = getReviewStatusFromBody(body);

    if (typeof status !== "string" || status.length === 0) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    if (!isValidReviewStatus(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // basic id validation to prevent weird input
    if (!isValidDocumentId(resolvedParams.id)) {
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
