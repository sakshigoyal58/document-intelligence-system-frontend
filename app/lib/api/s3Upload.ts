function buildS3UploadRequest(file: File): RequestInit {
  return {
    method: "PUT",
    body: file,
  };
}

async function parseS3UploadResponse(res: Response): Promise<void> {
  if (!res.ok) {
    const text = await res.text();
    console.error("S3 upload failed:", text);
    throw new Error("S3 upload failed");
  }
}

export async function uploadToS3(file: File, uploadUrl: string) {
  const res = await fetch(uploadUrl, buildS3UploadRequest(file));
  await parseS3UploadResponse(res);
}