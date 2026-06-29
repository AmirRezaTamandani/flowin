"use client";

export default function DashboardStats() {
  return (
    <section className="dashboard-stats" aria-label="خلاصه حساب">
      <div className="stat-card stat-card-profile">
        <div className="stat-card-top">
          <div className="stat-avatar" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="#c4c4c4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#c4c4c4" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-name">Amir Reza Tamandani</p>
            <p className="stat-sub">09107066626</p>
          </div>
        </div>
        <button type="button" className="stat-action-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          ویرایش پروفایل
        </button>
      </div>

      <div className="stat-card">
        <div className="stat-card-top">
          <div className="stat-icon stat-icon-yellow" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-value">1 روز پیش</p>
            <p className="stat-sub">عضوی از ما شدی</p>
          </div>
        </div>
        <button type="button" className="stat-action-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="7" cy="7" r="1" fill="currentColor" />
          </svg>
          تخفیف های شما
        </button>
      </div>

      <div className="stat-card">
        <div className="stat-card-top">
          <div className="stat-icon stat-icon-yellow" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-value">0 تومان</p>
            <p className="stat-sub">موجودی کیف پول شماست</p>
          </div>
        </div>
        <button type="button" className="stat-action-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          افزایش موجودی
        </button>
      </div>

      <div className="stat-card">
        <div className="stat-card-top">
          <div className="stat-icon stat-icon-yellow" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 3v18M3 8l9 5 9-5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-value">0 بار</p>
            <p className="stat-sub">تعداد سفارش های شما</p>
          </div>
        </div>
        <button type="button" className="stat-action-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6h15l-1.5 9h-12L6 6z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          جزئیات بیشتر
        </button>
      </div>
    </section>
  );
}
