import { NextResponse } from "next/server";
import {
  badRequest,
  notFound,
  unauthorized,
} from "@/app/lib/api/responses";
import { parseDraftSubmissionRequest } from "@/app/lib/api/validate";
import { requireUserId } from "@/app/lib/db/auth";
import { getBrandForUser } from "@/app/lib/db/brands";
import { upsertDraftSubmission } from "@/app/lib/db/submissions";

type RouteContext = { params: Promise<{ brandId: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const userId = requireUserId(request);
  if (!userId) return unauthorized();

  const { brandId } = await context.params;
  const brand = await getBrandForUser(brandId, userId);
  if (!brand) return notFound();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const parsed = parseDraftSubmissionRequest(body);
  if (!parsed.ok) return badRequest(parsed.message);

  const submission = await upsertDraftSubmission({
    brandId,
    surveyId: parsed.data.surveyId,
    answers: parsed.data.answers,
    normalizedAnswers: parsed.data.normalizedAnswers ?? [],
  });

  return NextResponse.json(submission);
}
