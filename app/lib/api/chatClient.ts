import { requestJson, requestText } from "@/app/lib/api/apiClient";

export type SearchResult = {
  documentId: string;
  documentName: string;
};

function buildSearchUrl(query: string): string {
  return `/api/documents/search?searchText=${encodeURIComponent(query)}`;
}

function isSearchResultRecord(
  value: unknown,
): value is { documentId: string; documentName: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).documentId === "string" &&
    typeof (value as Record<string, unknown>).documentName === "string"
  );
}

export async function fetchDocumentSearch(
  query: string,
  fetchFn: typeof fetch = fetch,
): Promise<SearchResult[]> {
  const data = await requestJson<unknown>(
    buildSearchUrl(query),
    {},
    "Failed to search documents",
    10000,
    fetchFn,
  );

  const responseData = data as Record<string, unknown> | undefined;
  const documents = Array.isArray(responseData?.documents)
    ? responseData.documents
    : Array.isArray(data)
    ? data
    : [];

  return (documents as unknown[])
    .filter(isSearchResultRecord)
    .map((item) => ({
      documentId: item.documentId,
      documentName: item.documentName,
    }));
}

function buildAskUrl(documentId: string): string {
  return `/api/documents/${encodeURIComponent(documentId)}/ask`;
}

export async function fetchDocumentAnswer(
  documentId: string,
  question: string,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  const responseText = await requestText(
    buildAskUrl(documentId),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    },
    "Failed to get document answer",
    50000,
    fetchFn,
  );

  try {
    const payload = JSON.parse(responseText) as Record<string, unknown>;
    if (typeof payload.answer === "string") {
      return payload.answer;
    }
  } catch {
    // ignore invalid JSON; fall through to return raw text
  }

  return responseText;
}
