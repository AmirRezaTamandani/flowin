"use client";

import { useState } from "react";
import Header from "../../components/Header";
import DashboardStats from "../../components/DashboardStats";
import AccountSidebar from "../../components/AccountSidebar";
import SurveyStepper from "../../components/SurveyStepper";
import BrandFormFooter from "../../components/BrandFormFooter";
import { surveyMap } from "../../lib/surveys";

export default function BrandFormPage() {
  const [activeSection, setActiveSection] = useState("branding");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const activeSurvey = surveyMap[activeSection] ?? surveyMap.branding;
  const showBrandFooter = activeSection === "branding";

  return (
    <div className="page-root">
      <Header />
      <div className="page-body">
        <DashboardStats />

        <div className="content-grid">
          <AccountSidebar
            activeSection={activeSection}
            openSubmenu={openSubmenu}
            onSectionChange={setActiveSection}
            onSubmenuToggle={setOpenSubmenu}
          />

          <main className="main-panel">
            <SurveyStepper survey={activeSurvey} />
            {showBrandFooter && <BrandFormFooter />}
          </main>
        </div>
      </div>
    </div>
  );
}
