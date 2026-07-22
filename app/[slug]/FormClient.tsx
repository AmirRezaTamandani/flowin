"use client";

import { Suspense } from "react";
import Header from "../components/Header";
import SurveyStepper from "../components/SurveyStepper";
import BrandFormFooter from "../components/BrandFormFooter";
import type { SurveyConfig } from "../lib/surveys";

function FormBody({ survey }: { survey: SurveyConfig }) {
  const showBrandFooter = survey.id === "branding";

  return (
    <main className="main-panel mx-auto w-full max-w-3xl">
      <SurveyStepper survey={survey} requireHandoffToken />
      {/* {showBrandFooter && <BrandFormFooter />} */}
    </main>
  );
}

export default function FormClient({ survey }: { survey: SurveyConfig }) {
  return (
    <div className="page-root">
      <Header />
      <div className="page-body">
        {/* Isolate useSearchParams() so it cannot bail the whole route into not-found */}
        <Suspense
          fallback={
            <main className="main-panel mx-auto flex min-h-[40vh] w-full max-w-3xl items-center justify-center">
              <p className="text-muted-foreground text-sm">
                در حال بارگذاری فرم...
              </p>
            </main>
          }
        >
          <FormBody survey={survey} />
        </Suspense>
      </div>
    </div>
  );
}
