import { Suspense } from "react";
import { resolveSurveySlug } from "@/app/lib/api/formSlugs";
import FormClient from "./FormClient";

type FormPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [
    "brand",
    "branding",
    "social",
    "social-strategy",
    "social-competitor",
    "seo",
    "campaign",
    "email",
    "sms",
    "push",
  ].map((slug) => ({ slug }));
}

export default async function FormPage({ params }: FormPageProps) {
  const { slug } = await params;
  const survey = resolveSurveySlug(slug);

  if (!survey) {
    return (
      <div className="page-root">
        <div className="page-body flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-lg font-semibold">فرم پیدا نشد</p>
          <p className="text-muted-foreground text-sm" dir="ltr">
            /form/{slug}
          </p>
        </div>
      </div>
    );
  }

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
