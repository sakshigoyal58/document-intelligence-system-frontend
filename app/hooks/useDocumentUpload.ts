import { useState } from "react";
import { requestPresignedUrl } from "../lib/helper/requestPresignedUrl";
import { uploadToS3 } from "../lib/api/s3Upload";
import { revalidateDocuments } from "../actions/revalidateDocument";

export function useDocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function upload() {
    if (!file) return;

    try {
      setLoading(true);
      setStatus("Preparing upload...");

      const { PresignedUrl } = await requestPresignedUrl(file.name);
      setStatus("Uploading file...");
      console.log("Uploading to S3 with URL:", PresignedUrl);

      await uploadToS3(file, PresignedUrl);

      setStatus("File uploaded successfully");

      await revalidateDocuments();
    } catch (error) {
      console.error("Upload failed", error);

      setStatus("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return {
    file,

    loading,

    status,

    selectFile: setFile,

    upload,
  };
}
