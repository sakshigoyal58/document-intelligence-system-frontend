import { getAuthorizedHeaders } from "@/app/lib/api/authHeaders";
import { requestText } from "@/app/lib/api/apiClient";

function parseResponsePayload(responseText: string): unknown {
  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

function extractAnswer(payload: unknown): string | null {
  if (typeof payload === "string") {
    const trimmed = payload.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const answer = typeof record.Answer === "string" ? record.Answer.trim() : "";

    if (answer.length > 0) {
      return answer;
    }
  }

  return null;
}

function unwrapStepFunctionsOutput(payload: unknown): unknown {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (typeof record.output === "string") {
      try {
        return JSON.parse(record.output);
      } catch {
        return payload;
      }
    }
  }

  return payload;
}

function getQuestionRequestBody(documentId: string, question: string): string {
  return JSON.stringify({ documentId, question });
}

export async function askDocumentQuestion(
  documentId: string,
  question: string,
  tokenFromRoute?: string,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  const headers = await getAuthorizedHeaders(true, tokenFromRoute);
  const responseText = await requestText(
    `${process.env.API_URL}/documents/${encodeURIComponent(documentId)}/ask`,
    {
      method: "POST",
      headers,
      body: getQuestionRequestBody(documentId, question),
    },
    "Failed to ask document question",
    50000,
    fetchFn,
  );

  const payload = parseResponsePayload(responseText);
  const unwrapped = unwrapStepFunctionsOutput(payload);
  const answer = extractAnswer(unwrapped);

  return answer ?? "No answer was returned.";
}
