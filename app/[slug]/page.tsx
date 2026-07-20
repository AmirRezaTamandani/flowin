import { notFound } from "next/navigation";
import { Suspense } from "react";
import { resolveSurveySlug } from "@/app/lib/api/formSlugs";
import FormClient from "./FormClient";

type FormPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FormPage({ params }: FormPageProps) {
  const { slug } = await params;
  const survey = resolveSurveySlug(slug);
  if (!survey) notFound();

  return (
    <Suspense
      fallback={
        <div className="page-root">
          <div className="page-body flex min-h-[40vh] items-center justify-center">
            <p className="text-muted-foreground text-sm">در حال بارگذاری فرم...</p>
          </div>
        </div>
      }
    >
      <FormClient survey={survey} />
    </Suspense>
  );
}
