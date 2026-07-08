import { cookies } from "next/headers";

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

export async function searchDocuments(query: string): Promise<SearchResult[]> {
  const token = (await cookies()).get("access_token")?.value;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const response = await fetch(
    `${process.env.API_URL}/documents/opensearch?searchText=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    }
  ).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to search documents:", errorText);
    throw new Error("Failed to search documents");
  }

  const responseText = await response.text();
  let payload: unknown = responseText;

  try {
    payload = JSON.parse(responseText);
  } catch {
    payload = responseText;
  }

  return normalizeSearchResults(payload);
}
