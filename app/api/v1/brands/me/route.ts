import { NextResponse } from "next/server";
import { getBrandByUserId } from "@/app/lib/db/brands";
import { requireUserId } from "@/app/lib/db/auth";
import { unauthorized } from "@/app/lib/api/responses";

export async function GET(request: Request) {
  const userId = requireUserId(request);
  if (!userId) return unauthorized();

  const brand = await getBrandByUserId(userId);
  return NextResponse.json(brand);
}
