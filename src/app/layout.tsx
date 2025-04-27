import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "../../public/fonts/NanumBarunGothic/NanumBarunGothic.css";
import "../../public/fonts/NanumBarunGothicBold/NanumBarunGothicBold.css";
import "../../public/fonts/NanumBarunGothicLight/NanumBarunGothicLight.css";
import "../../public/fonts/NanumBarunGothicUltraLight/NanumBarunGothicUltraLight.css";
import "../../public/fonts/korail_Condensed/korail_Condensed.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EasterEgg from "@/components/EasterEgg";

export const metadata: Metadata = {
  title: "99haus",
  description: "99haus by Jun Park",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="color-scheme" content="dark only" />
        <meta name="supported-color-schemes" content="dark" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`px-8 min-h-[100dvh] grid grid-rows-[auto,1fr,auto] prose-p:text-foreground prose-headings:text-foreground overflow-y-scroll
          font-nanum-barun-gothic
          `}
      >
        <Header />
        <main className="flex flex-col py-16 w-full mx-auto overflow-hidden">
          {children}
        </main>
        <Footer />
      </body>
      <EasterEgg />
    </html>
  );
}
