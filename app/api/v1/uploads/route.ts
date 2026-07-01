import { notImplemented } from "@/app/lib/api/responses";

export async function POST() {
  return notImplemented("POST /api/v1/uploads", "Use multipart/form-data with file, purpose, brandId");
}
