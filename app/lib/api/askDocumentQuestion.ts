import { cookies } from "next/headers";

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

// NEW: unwrap the Step Functions StartSyncExecution response shape
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

export async function askDocumentQuestion(
  documentId: string,
  question: string,
  tokenFromRoute?: string
): Promise<string> {
  const token = tokenFromRoute ?? (await cookies()).get("access_token")?.value;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 50000);

  const response = await fetch(
    `${process.env.API_URL}/documents/${encodeURIComponent(documentId)}/ask`,
    {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentId, question }),
      signal: controller.signal,
    }
  ).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to ask document question:", errorText);
    throw new Error("Failed to ask document question");
  }

  const responseText = await response.text();
  let payload: unknown = responseText;

  try {
    payload = JSON.parse(responseText);
  } catch {
    payload = responseText;
  }

  const unwrapped = unwrapStepFunctionsOutput(payload); // NEW step
  const answer = extractAnswer(unwrapped);
  return answer ?? "No answer was returned.";
}