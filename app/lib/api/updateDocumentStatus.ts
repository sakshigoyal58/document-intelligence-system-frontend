import { getAuthorizedHeaders, requestText } from "@/app/lib/api/apiClient";
import { buildJsonBody } from "@/app/lib/helper/requestHelpers";

export async function updateDocumentStatus(
  documentId: string,
  status: string,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  const headers = await getAuthorizedHeaders(true);

  return requestText(
    `${process.env.API_URL}/documents/${documentId}/review`,
    {
      method: "PATCH",
      headers,
      body: buildJsonBody({ status }),
    },
    "Failed to update document status",
    10000,
    fetchFn,
  );
}
