import { notImplemented } from "@/app/lib/api/responses";

type RouteContext = { params: Promise<{ brandId: string; submissionId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { brandId, submissionId } = await context.params;
  return notImplemented(`GET /api/v1/brands/${brandId}/submissions/${submissionId}`);
}

export async function PATCH(_request: Request, context: RouteContext) {
  const { brandId, submissionId } = await context.params;
  return notImplemented(`PATCH /api/v1/brands/${brandId}/submissions/${submissionId}`);
}
