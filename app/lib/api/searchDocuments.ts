import { getAuthorizedHeaders } from "@/app/lib/api/authHeaders";
import { requestJson } from "@/app/lib/api/apiClient";

export type SearchResult = {
  documentId: string;
  documentName: string;
};

function normalizeSearchResults(payload: unknown): SearchResult[] {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => {
        if (typeof item === "string") {
          return { documentId: item, documentName: item };
        }

        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          const documentId = [
            record.documentId,
            record.DocumentId,
            record.id,
            record.Id,
          ].find((value): value is string => typeof value === "string" && value.trim().length > 0);

          const documentName = [
            record.documentName,
            record.DocumentName,
            record.FileName,
            record.fileName,
            record.name,
            record.title,
          ].find((value): value is string => typeof value === "string" && value.trim().length > 0);

          if (documentId || documentName) {
            return {
              documentId: documentId ?? documentName ?? "",
              documentName: documentName ?? documentId ?? "",
            };
          }
        }

        return null;
      })
      .filter((item): item is SearchResult => Boolean(item && item.documentId && item.documentName));
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const nestedResults = record.results ?? record.documents ?? record.items ?? record.data;

    if (Array.isArray(nestedResults)) {
      return normalizeSearchResults(nestedResults);
    }
  }

  return [];
}

function buildSearchUrl(query: string): string {
  return `${process.env.API_URL}/documents/opensearch?searchText=${encodeURIComponent(query)}`;
}

export async function searchDocuments(query: string, fetchFn: typeof fetch = fetch): Promise<SearchResult[]> {
  const headers = await getAuthorizedHeaders(true);
  const payload = await requestJson<unknown>(
    buildSearchUrl(query),
    { headers },
    "Failed to search documents",
    10000,
    fetchFn,
  );

  return normalizeSearchResults(payload);
}
