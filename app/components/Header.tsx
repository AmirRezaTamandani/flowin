"use client";

import Image from "next/image";
import { getAppBasePath } from "@/app/lib/api/basePath";

export default function Header() {
  const basePath = getAppBasePath();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-brand">
          <div className="site-logo">
            <Image
              src={`${basePath}/Felowin-Logo-v3-Hor-Dark-En.svg`}
              alt="Felowin"
              width={152}
              height={40}
              style={{ width: "auto", height: 40 }}
              loading="eager"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
}
