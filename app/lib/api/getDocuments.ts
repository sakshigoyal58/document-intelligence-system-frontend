import { Document } from "@/app/types/document";
import { getAuthorizedHeaders, requestJson } from "@/app/lib/api/apiClient";

export async function getDocuments(fetchFn: typeof fetch = fetch): Promise<Document[]> {
  const headers = await getAuthorizedHeaders(false);

  return requestJson<Document[]>(
    process.env.API_URL + "/documents",
    {
      next: { tags: ["documents"], revalidate: 60 },
      headers,
    },
    "Failed to fetch documents",
    10000,
    fetchFn,
  );
}
