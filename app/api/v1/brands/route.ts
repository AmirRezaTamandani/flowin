import { NextResponse } from "next/server";
import { badRequest, conflict, unauthorized } from "@/app/lib/api/responses";
import { createBrand } from "@/app/lib/db/brands";
import { requireUserId } from "@/app/lib/db/auth";

export async function POST(request: Request) {  const userId = requireUserId(request);
  if (!userId) return unauthorized();

  let body: unknown = {};
  try {
    const text = await request.text();
    if (text.trim()) body = JSON.parse(text);
  } catch {
    return badRequest("Invalid JSON body");
  }

  const record = body as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name : undefined;
  const websiteUrl =
    typeof record.websiteUrl === "string" ? record.websiteUrl : undefined;

  const result = await createBrand(userId, { name, websiteUrl });
  if (result === "conflict") {
    return conflict("User already has a brand");
  }

  return NextResponse.json(result, { status: 201 });
}
