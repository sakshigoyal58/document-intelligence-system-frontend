import { requestText } from "@/app/lib/api/apiClient";

export type ReviewStatus = "APPROVED" | "REJECTED";

export async function reviewDocumentStatus(
  documentId: string,
  status: ReviewStatus,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  return requestText(
    `/api/documents/${documentId}/review`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
    "Failed to update document review status",
    10000,
    fetchFn,
  );
}
