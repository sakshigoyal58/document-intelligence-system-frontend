export type PresignedUrlResponse = {
  documentId: string;
  uploadUrl: string;
};

export async function requestPresignedUrl(
  fileName: string,
): Promise<PresignedUrlResponse> {
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName,
    }),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(error || "Failed to initialize upload");
  }

  return response.json();
}



