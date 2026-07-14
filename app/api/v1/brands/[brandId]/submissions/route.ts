import { NextResponse } from "next/server";
import {
  badRequest,
  conflict,
  notFound,
  unauthorized,
} from "@/app/lib/api/responses";
import { isSurveyId, type SubmissionStatus, type SurveyId } from "@/app/lib/api/types";
import { parseCreateSubmissionRequest } from "@/app/lib/api/validate";
import { requireUserId } from "@/app/lib/db/auth";
import { getBrandForUser } from "@/app/lib/db/brands";
import { createSubmission, listSubmissions } from "@/app/lib/db/submissions";

type RouteContext = { params: Promise<{ brandId: string }> };

export async function GET(request: Request, context: RouteContext) {
  const userId = requireUserId(request);
  if (!userId) return unauthorized();

  const { brandId } = await context.params;
  const brand = await getBrandForUser(brandId, userId);
  if (!brand) return notFound();

  const url = new URL(request.url);
  const surveyIdParam = url.searchParams.get("surveyId");
  const statusParam = url.searchParams.get("status");

  const filters: { surveyId?: SurveyId; status?: SubmissionStatus } = {};
  if (surveyIdParam) {
    if (!isSurveyId(surveyIdParam)) return badRequest("Invalid surveyId");
    filters.surveyId = surveyIdParam;
  }
  if (statusParam === "draft" || statusParam === "completed") {
    filters.status = statusParam;
  }

  const items = await listSubmissions(brandId, filters);
  return NextResponse.json({ items });
}

export async function POST(request: Request, context: RouteContext) {
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

  const parsed = parseCreateSubmissionRequest(body);
  if (!parsed.ok) return badRequest(parsed.message);

  const result = await createSubmission({
    brandId,
    surveyId: parsed.data.surveyId,
    status: parsed.data.status,
    answers: parsed.data.answers,
    normalizedAnswers: parsed.data.normalizedAnswers ?? [],
    completedAt: parsed.data.completedAt,
  });

  if (result === "branding_conflict") {
    return conflict("Branding survey already completed for this brand");
  }

  return NextResponse.json(result, { status: 201 });
}
