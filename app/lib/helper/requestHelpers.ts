import { NextRequest } from "next/server";

export function createAuthHeaders(token?: string): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function createJsonHeaders(token?: string): HeadersInit {
  return {
    ...createAuthHeaders(token),
    "Content-Type": "application/json",
  };
}

export function buildJsonBody(payload: Record<string, unknown>): string {
  return JSON.stringify(payload);
}

export async function parseJsonResponse<T>(res: Response, errorMessage: string): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    console.error(errorMessage, text);
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

export async function parseTextResponse(res: Response, errorMessage: string): Promise<string> {
  if (!res.ok) {
    const text = await res.text();
    console.error(errorMessage, text);
    throw new Error(errorMessage);
  }

  return res.text();
}

export function isValidDocumentId(documentId: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(documentId);
}

export function getReviewStatusFromBody(body: unknown): string | undefined {
  if (body && typeof body === "object") {
    const status = (body as Record<string, unknown>).status;
    return typeof status === "string" ? status : undefined;
  }

  return undefined;
}

export function isValidReviewStatus(status: string): boolean {
  return status === "APPROVED" || status === "REJECTED";
}

export function getSearchQueryFromRequest(req: NextRequest): string {
  return req.nextUrl.searchParams.get("searchText")?.trim() ?? "";
}

export function buildSearchResponse(documents: Array<{ documentId: string; documentName: string }>) {
  return { documents: documents.slice(0, 10) };
}

export async function parseJsonBody(req: Request): Promise<unknown> {
  return req.json();
}

export function getFileNameFromBody(body: unknown): string | undefined {
  if (body && typeof body === "object") {
    const fileName = (body as Record<string, unknown>).fileName;
    return typeof fileName === "string" ? fileName : undefined;
  }

  return undefined;
}
