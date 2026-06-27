import { cookies } from "next/headers";

export async function updateDocumentStatus(
  documentId: string,
  status: string
): Promise<string> {

  const token = (await cookies()).get("access_token")?.value;
  console.log("Access token:", token);

  // add a timeout for the upstream request to avoid hanging calls
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const res = await fetch(`${process.env.API_URL}/documents/${documentId}/review`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!res.ok) {
    const errorText = await res.text();
    console.log("Failed to update document status:", errorText);
    throw new Error("Failed to update document status");
  }

  const responseMessage = await res.text();
  console.log("Document status updated successfully:", responseMessage);
  return responseMessage;
}
