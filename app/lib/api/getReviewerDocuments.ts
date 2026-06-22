import { Document } from "@/app/types/document";
import { cookies } from "next/headers";

export async function getReviewerDocuments(): Promise<Document[]>{

  const token = (await cookies()).get("access_token")?.value;
  console.log("Access token:", token);
  const res = await fetch(
    `${process.env.API_URL}/documents?status=VALIDATED,VALIDATION_FAILED`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    console.log(await res.text());
    throw new Error("Failed to fetch documents");
  }
  const data: Document[] = await res.json();

  console.log("Response status:", data);

  return data;
}