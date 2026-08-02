import { getAuthorizedHeaders } from "@/app/lib/api/authHeaders";
import { requestJson } from "@/app/lib/api/apiClient";

export type PresignedUrlResponse = {
  documentId: string;
  uploadUrl: string;
};

function getUploadRequestBody(fileName: string): string {
  return JSON.stringify({ fileName });
}

export async function getPresignedUrl(
  fileName: string,
  fetchFn: typeof fetch = fetch,
): Promise<PresignedUrlResponse> {
  if (!fileName) {
    throw new Error("Missing fileName");
  }

  const headers = await getAuthorizedHeaders(true);

  return requestJson<PresignedUrlResponse>(
    `${process.env.API_URL}/upload`,
    {
      method: "POST",
      headers,
      body: getUploadRequestBody(fileName),
    },
    "Failed to get presigned URL",
    10000,
    fetchFn,
  );
}
