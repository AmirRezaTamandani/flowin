import { badRequest, notImplemented } from "@/app/lib/api/responses";
import { parseCreateSubmissionRequest } from "@/app/lib/api/validate";

type RouteContext = { params: Promise<{ brandId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { brandId } = await context.params;
  return notImplemented(`GET /api/v1/brands/${brandId}/submissions`);
}

export async function POST(request: Request, context: RouteContext) {
  const { brandId } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const parsed = parseCreateSubmissionRequest(body);
  if (!parsed.ok) {
    return badRequest(parsed.message);
  }

  return notImplemented(`POST /api/v1/brands/${brandId}/submissions`, JSON.stringify(parsed.data));
}
