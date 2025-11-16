import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "../../public/fonts/NanumBarunGothic/NanumBarunGothic.css";
import "../../public/fonts/NanumBarunGothicBold/NanumBarunGothicBold.css";
import "../../public/fonts/NanumBarunGothicLight/NanumBarunGothicLight.css";
import "../../public/fonts/NanumBarunGothicUltraLight/NanumBarunGothicUltraLight.css";
import "../../public/fonts/korail_Condensed/korail_Condensed.css";

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
    <html lang="ko">
      <body className={``}>{children}</body>
    </html>
  );
}
