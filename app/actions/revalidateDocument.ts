"use server";

import { revalidateTag } from "next/cache";

export async function revalidateDocuments() {
  revalidateTag("documents", "default");
}