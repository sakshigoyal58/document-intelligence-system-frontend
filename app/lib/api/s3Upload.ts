export async function uploadToS3(file: File, uploadUrl: string) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("S3 ERROR:", text);
    throw new Error("S3 upload failed");
  }
}