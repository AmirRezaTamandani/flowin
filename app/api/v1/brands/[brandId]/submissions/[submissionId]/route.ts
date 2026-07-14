import { NextResponse } from "next/server";
import {
  badRequest,
  conflict,
  notFound,
  unauthorized,
} from "@/app/lib/api/responses";
import { parseUpdateSubmissionRequest } from "@/app/lib/api/validate";
import { requireUserId } from "@/app/lib/db/auth";
import { getBrandForUser } from "@/app/lib/db/brands";
import {
  getSubmissionById,
  updateSubmission,
} from "@/app/lib/db/submissions";

type RouteContext = { params: Promise<{ brandId: string; submissionId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const userId = requireUserId(_request);
  if (!userId) return unauthorized();

  const { brandId, submissionId } = await context.params;
  const brand = await getBrandForUser(brandId, userId);
  if (!brand) return notFound();

  const submission = await getSubmissionById(brandId, submissionId);
  if (!submission) return notFound();

  return NextResponse.json(submission);
}

export async function PATCH(request: Request, context: RouteContext) {
  const userId = requireUserId(request);
  if (!userId) return unauthorized();

  const { brandId, submissionId } = await context.params;
  const brand = await getBrandForUser(brandId, userId);
  if (!brand) return notFound();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const parsed = parseUpdateSubmissionRequest(body);
  if (!parsed.ok) return badRequest(parsed.message);

  const result = await updateSubmission(brandId, submissionId, {
    status: parsed.data.status,
    answers: parsed.data.answers,
    normalizedAnswers: parsed.data.normalizedAnswers,
    completedAt: parsed.data.completedAt,
  });

  if (result === "not_found") return notFound();
  if (result === "branding_conflict") {
    return conflict("Branding survey already completed for this brand");
  }

  return NextResponse.json(result);
}
