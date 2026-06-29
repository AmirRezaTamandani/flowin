import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "فلووین | افزودن اطلاعات برند",
  description: "فرم اطلاعات برند فلووین",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body
        suppressHydrationWarning={true}
        className="flex flex-col min-h-full"
      >
        {children}
      </body>
    </html>
  );
}
