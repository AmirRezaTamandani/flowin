"use client";

import { Suspense, useState } from "react";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import AccountSidebar from "./components/AccountSidebar";
import MockOtpAuth from "./components/MockOtpAuth";
import SurveyStepper from "./components/SurveyStepper";
import BrandFormFooter from "./components/BrandFormFooter";
import { useAuthStore } from "./lib/authStore";
import { surveyMap } from "./lib/surveys";

export default function Home() {
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [activeSection, setActiveSection] = useState("branding");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const activeSurvey = surveyMap[activeSection];
  const showBrandFooter = activeSection === "branding";

  return (
    <div className="page-root">
      <Header />
      <div className="page-body">
        {!hasHydrated ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="bg-card shadow-sm px-6 py-10 border border-border rounded-3xl w-full max-w-md text-center">
              <p className="text-muted-foreground text-sm">
                در حال بارگذاری وضعیت ورود...
              </p>
            </div>
          </div>
        ) : !token ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <MockOtpAuth />
          </div>
        ) : (
          <>
            <DashboardStats />

            <div className="content-grid">
              <AccountSidebar
                activeSection={activeSection}
                openSubmenu={openSubmenu}
                onSectionChange={setActiveSection}
                onSubmenuToggle={setOpenSubmenu}
              />

              <main className="main-panel">
                {activeSurvey ? (
                  <>
                    <Suspense
                      fallback={
                        <p className="text-muted-foreground text-sm">
                          در حال بارگذاری فرم...
                        </p>
                      }
                    >
                      <SurveyStepper survey={activeSurvey} />
                    </Suspense>
                    {/* {showBrandFooter && <BrandFormFooter />} */}
                  </>
                ) : (
                  <p className="section-empty">این بخش هنوز آماده نیست.</p>
                )}
              </main>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
