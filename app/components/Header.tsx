"use client";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-brand">
          <div className="site-logo">
            <span className="site-logo-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 2v6l6 3 6-3V2M6 8l6 3 6-3M6 14v6l6 3 6-3v-6l-6 3-6-3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="site-logo-text">FELOWIN</span>
          </div>
          <span className="site-tagline">مارکتینگ هوشمند با فلووین</span>
        </div>

        <div className="site-header-actions">
          <span className="site-welcome">
            Amir Reza Tamandani <strong>خوش آمدید</strong>
          </span>
          <button type="button" className="header-btn header-btn-account">
            حساب کاربری
          </button>
          <button type="button" className="header-btn header-btn-cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6h15l-1.5 9h-12L6 6zM6 6L5 3H2M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            سبد خرید
          </button>
        </div>
      </div>
    </header>
  );
}
