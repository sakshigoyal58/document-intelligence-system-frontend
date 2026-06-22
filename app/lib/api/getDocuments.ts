import { Document } from "@/app/types/document";
import { cookies } from "next/headers";

export async function getDocuments(): Promise<Document[]> {
   const token = (await cookies()).get("access_token")?.value;
   console.log("Access token:", token);
  const res = await fetch(process.env.API_URL + "/documents", {
    next: { tags: ["documents"], revalidate: 60 },
    headers: {
        Authorization: `Bearer ${token}`,
      },
    
  });

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch documents");
  }

  const data: Document[] = await res.json();

  return data;
}