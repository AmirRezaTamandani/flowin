"use client";
import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import StatsCards from "./components/StatsCards";
import SurveyStepper from "./components/SurveyStepper";

type SurveyConfig = {
  id: string;
  label: string;
  title: string;
  description: string;
  steps: Array<{
    id: number;
    question: string;
    type: "text" | "radio" | "select";
    placeholder?: string;
    options?: string[];
  }>;
};

const surveyMap: Record<string, SurveyConfig> = {
  dashboard: {
    id: "dashboard",
    label: "داشبورد",
    title: "اطلاعات اولیه کسب و کار",
    description: "این بخش برای جمع آوری داده های پایه شما طراحی شده است.",
    steps: [
      {
        id: 1,
        question: "نام برند شما چیست؟",
        type: "text",
        placeholder: "مثلاً آرتین استور",
      },
      {
        id: 2,
        question: "هدف شما از راه اندازی فروشگاه چیست؟",
        type: "radio",
        options: ["فروش بیشتر", "برندسازی", "آشنایی با مشتری"],
      },
      {
        id: 3,
        question: "اولویت شما در ماه جاری چیست؟",
        type: "select",
        options: ["تولید محتوا", "بهینه سازی سایت", "تبلیغات"],
      },
    ],
  },
  profile: {
    id: "profile",
    label: "پروفایل",
    title: "تکمیل پروفایل کاربری",
    description: "اطلاعات شما را برای تجربه بهتر شخصی سازی می کنیم.",
    steps: [
      {
        id: 1,
        question: "نام و نام خانوادگی شما چیست؟",
        type: "text",
        placeholder: "مثلاً امیررضا",
      },
      {
        id: 2,
        question: "به کدام حوزه علاقه دارید؟",
        type: "radio",
        options: ["طراحی", "توسعه", "بازاریابی"],
      },
      {
        id: 3,
        question: "مناسب ترین زمان تماس چه زمانی است؟",
        type: "select",
        options: ["صبح", "ظهر", "عصر"],
      },
      {
        id: 4,
        question: "ملاحظات حقوقی یا فنی دارید؟",
        type: "text",
        placeholder: "توضیح کوتاه",
      },
    ],
  },
  branding: {
    id: "branding",
    label: "برندینگ",
    title: "خدمات برندینگ",
    description: "برای طراحی تجربه برندتان، چند سوال کوتاه پاسخ دهید.",
    steps: [
      {
        id: 1,
        question: "هویت برند شما چگونه باید دیده شود؟",
        type: "text",
        placeholder: "توضیح کوتاه",
      },
      {
        id: 2,
        question: "رنگ برند شما چیست؟",
        type: "radio",
        options: ["آبی", "سبز", "نارنجی", "مشکی"],
      },
      {
        id: 3,
        question: "آیا به یک هویت تصویری تازه نیاز دارید؟",
        type: "select",
        options: ["بله", "خیر", "ممکن است"],
      },
      {
        id: 4,
        question: "توضیح کوتاه درباره پیام برندتان",
        type: "text",
        placeholder: "پیام برند",
      },
    ],
  },
  seo: {
    id: "seo",
    label: "سئو",
    title: "سئو و رشد ارگانیک",
    description: "برای برنامه ریزی سئو، چند سوال ساده را کامل کنید.",
    steps: [
      {
        id: 1,
        question: "دامنه فعلی شما چیست؟",
        type: "text",
        placeholder: "example.com",
      },
      {
        id: 2,
        question: "حجم فعالیت محتوایی شما چقدر است؟",
        type: "radio",
        options: ["کم", "متوسط", "زیاد"],
      },
      {
        id: 3,
        question: "هدف اصلی سئو چیست؟",
        type: "select",
        options: ["رشد ترافیک", "فروش بیشتر", "بهبود برند"],
      },
      {
        id: 4,
        question: "به کدام کلمات کلیدی توجه می کنید؟",
        type: "text",
        placeholder: "کلمات کلیدی",
      },
    ],
  },
};

const navItems = [
  { id: "dashboard", label: "داشبورد" },
  { id: "profile", label: "پروفایل" },
  {
    id: "services",
    label: "خدمات",
    children: [
      { id: "branding", label: "برندینگ" },
      { id: "seo", label: "سئو" },
    ],
  },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const activeSurvey = surveyMap[activeSection] ?? surveyMap.dashboard;

  return (
    <div className="page-root">
      <div className="shell">
        <div className="content-area">
          <nav className="top-nav" aria-label="وضعیت فعال">
            <span className="top-nav-label">بخش فعال</span>
            <span className="top-nav-value">{activeSurvey.label}</span>
          </nav>

          <div className="container">
            <main className="main-panel">
              <div className="section-header">
                <p className="section-eyebrow">بخش جاری</p>
                <h1 className="section-title">{activeSurvey.title}</h1>
                <p className="section-description">
                  {activeSurvey.description}
                </p>
              </div>

              <StatsCards />
              <SurveyStepper survey={activeSurvey} />
            </main>

            <div className="side-column">
              <ProfileCard />

              <aside className="sidebar" aria-label="منوی کناری">
                <div className="sidebar-title">منو</div>
                {navItems.map((item) => (
                  <div key={item.id} className="sidebar-group">
                    {item.children ? (
                      <>
                        <button
                          className="sidebar-group-button"
                          onClick={() =>
                            setOpenSubmenu(
                              openSubmenu === item.id ? null : item.id,
                            )
                          }
                        >
                          {item.label}
                          <span
                            className={`chevron ${openSubmenu === item.id ? "open" : ""}`}
                          >
                            ›
                          </span>
                        </button>
                        {openSubmenu === item.id && (
                          <div className="submenu-items">
                            {item.children.map((child) => (
                              <button
                                key={child.id}
                                className={`sidebar-item ${activeSection === child.id ? "active" : ""}`}
                                onClick={() => setActiveSection(child.id)}
                              >
                                {child.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        className={`sidebar-item ${activeSection === item.id ? "active" : ""}`}
                        onClick={() => setActiveSection(item.id)}
                      >
                        {item.label}
                      </button>
                    )}
                  </div>
                ))}
              </aside>

              <div className="side-placeholder">حساب کاربری من</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
