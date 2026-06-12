import { Document } from "@/app/types/document";

export async function getDocuments(): Promise<Document[]> {
  const res = await fetch(process.env.API_URL + "/documents", {
    next: { tags: ["documents"], revalidate: 60 }
  });

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch documents");
  }

  const data: Document[] = await res.json();

  console.log("Fetched documents:", data);

  return data;
}