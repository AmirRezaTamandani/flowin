import { Suspense } from "react";
import type { SurveyConfig } from "@/app/lib/surveys";
import FormClient from "@/app/[slug]/FormClient";

function FormFallback() {
  return (
    <div className="page-root">
      <div className="page-body flex min-h-[40vh] items-center justify-center">
        <p className="text-muted-foreground text-sm">در حال بارگذاری فرم...</p>
      </div>
    </div>
  );
}

/** Static form route wrapper (avoids flaky `[slug]` resolution for known WP paths). */
export default function StaticFormPage({ survey }: { survey: SurveyConfig }) {
  return (
    <Suspense fallback={<FormFallback />}>
      <FormClient survey={survey} />
    </Suspense>
  );
}
