import { Document } from "@/app/types/document";
import { getAuthorizedHeaders, requestJson } from "@/app/lib/api/apiClient";

export async function getReviewerDocuments(fetchFn: typeof fetch = fetch): Promise<Document[]> {
  const headers = await getAuthorizedHeaders(false);

  return requestJson<Document[]>(
    `${process.env.API_URL}/documents?status=VALIDATED,VALIDATION_FAILED`,
    { headers },
    "Failed to fetch reviewer documents",
    10000,
    fetchFn,
  );
}
