"use client";

import Header from "../components/Header";
import SurveyStepper from "../components/SurveyStepper";
import BrandFormFooter from "../components/BrandFormFooter";
import type { SurveyConfig } from "../lib/surveys";

export default function FormClient({ survey }: { survey: SurveyConfig }) {
  const showBrandFooter = survey.id === "branding";

  return (
    <div className="page-root">
      <Header />
      <div className="page-body">
        <main className="main-panel mx-auto w-full max-w-3xl">
          <SurveyStepper survey={survey} requireHandoffToken />
          {showBrandFooter && <BrandFormFooter />}
        </main>
      </div>
    </div>
  );
}
