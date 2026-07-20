"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-brand">
          <div className="site-logo">
            <span className="site-logo-icon" aria-hidden="true">
              <Image
                src="Felowin-Logo-v3-Hor-Dark-En.svg"
                alt="logo"
                width={200}
                height={200}
              />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
