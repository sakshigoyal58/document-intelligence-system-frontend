export type PresignedUrlResponse = {
  PresignedUrl: string;
};

export async function getPresignedUrl(fileName: string): Promise<PresignedUrlResponse> {
  if (!fileName) {
    throw new Error("Missing fileName");
  }

  const res = await fetch(`${process.env.API_URL}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName,
      userId: "user123", // Replace with actual user ID when available
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to get presigned URL:", text);
    throw new Error("Failed to get presigned URL");
  }

  return res.json();
}
