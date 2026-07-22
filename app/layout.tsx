import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
export const metadata: Metadata = {
  title: "فلووین | افزودن اطلاعات برند",
  description: "فرم اطلاعات برند فلووین",
};

const modam = localFont({
  src: [
    {
      path: "./fonts/modam/Modam-Light-b.woff2",
      weight: "400",
      style: "normal",
    },
    // Add the bold/black weights here as well
  ],
  variable: "--font-modam",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${modam.variable} font-sans antialiased h-full`}
    >
      <body
        suppressHydrationWarning={true}
        className="flex flex-col min-h-full"
      >
        {children}
      </body>
    </html>
  );
}
