"use client";

export default function BrandFormFooter() {
  return (
    <footer className="brand-form-footer">
      <div className="brand-form-divider">
        <span>آخرین فرم برندی که پر کرده اید:</span>
      </div>

      <div className="brand-form-alert">
        <span className="brand-form-alert-icon" aria-hidden="true">!</span>
        <p>
          فقط یک برند می‌توانید ثبت نمایید. در صورتی که نیاز به تغییر اطلاعات
          برند دارید، به پشتیبانی تیکت بزنید.
        </p>
      </div>

      <button type="button" className="brand-form-support-btn">
        ورود به بخش پشتیبانی
      </button>

      <div className="brand-form-submission">
        <span className="brand-form-submission-label">شناسه ثبت اطلاعات</span>
        <span className="brand-form-submission-id">[submission_id]</span>
      </div>
    </footer>
  );
}
