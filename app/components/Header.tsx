"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-brand">
          <div className="site-logo">
            <span aria-hidden="true">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Felowin-Logo-v3-Hor-Dark-En.svg`}
                alt="logo"
                width={200}
                height={200}
                style={{ width: "auto", height: "auto" }}
                loading="eager"
              />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
