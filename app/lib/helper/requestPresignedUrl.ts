export type PresignedUrlResponse = {
  FileKey: string;
  PresignedUrl: string;
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
    const contentType = response.headers.get("content-type") ?? "";
    const errorMessage =
      contentType.includes("application/json")
        ? ((await response.json()) as { error?: string }).error
        : await response.text();

    throw new Error(errorMessage || "Failed to initialize upload");
  }

  return response.json();
}



