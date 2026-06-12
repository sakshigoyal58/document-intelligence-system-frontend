"use server";

export async function getPresignedUrl(fileName: string) {
  const res = await fetch(
    `${process.env.API_URL}/upload`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: fileName,
        userId: "user123", // Replace with actual user ID if available
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get presigned URL");
  }

  return res.json();
}