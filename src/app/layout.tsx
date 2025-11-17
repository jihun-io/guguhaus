import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "../../public/fonts/NanumBarunGothic/NanumBarunGothic.css";
import "../../public/fonts/NanumBarunGothicBold/NanumBarunGothicBold.css";
import "../../public/fonts/NanumBarunGothicLight/NanumBarunGothicLight.css";
import "../../public/fonts/NanumBarunGothicUltraLight/NanumBarunGothicUltraLight.css";
import "../../public/fonts/korail_Condensed/korail_Condensed.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "99haus",
  description: "이야기가 시작되는 곳.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="overflow-x-hidden">
      <body className="p-4 min-h-screen grid grid-rows-[auto_1fr_auto] max-w-3xl mx-auto gap-11">
        <Header />
        <div className="h-auto overflow-x-hidden">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
