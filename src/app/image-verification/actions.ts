"use server";

import { verifyHostelImage } from "@/ai/flows/verify-hostel-images";
import { z } from "zod";

const inputSchema = z.object({
  photoDataUri: z.string().refine(val => val.startsWith('data:image/'), {
    message: "Must be a data URI for an image",
  })
});

export async function verifyImageAction(formData: FormData) {
  const rawData = {
    photoDataUri: formData.get("photoDataUri"),
  };
  
  const validation = inputSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: "Invalid input.", details: validation.error.format() };
  }
  
  try {
    const result = await verifyHostelImage(validation.data);
    return { success: true, data: result };
  } catch (e: any) {
    return { error: "AI verification failed.", details: e.message };
  }
}
