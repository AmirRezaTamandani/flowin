import { NextResponse } from "next/server";
import { getSurveyMetadataList } from "@/app/lib/api/surveyMetadata";

export async function GET() {
  return NextResponse.json({ items: getSurveyMetadataList() });
}
