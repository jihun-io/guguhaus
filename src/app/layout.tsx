import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const korailCondensed = localFont({
  src: "./fonts/KORAILCondensed-Regular.woff2",
  variable: "--font-korail-condensed",
});

const nanumBarunGothic = localFont({
  src: [
    {
      path: "./fonts/NanumBarunGothic.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NanumBarunGothicBold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nanum-barun-gothic",
});

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
      <body
        className={`px-8 min-h-screen grid grid-rows-[auto,1fr,auto] prose-p:text-foreground prose-headings:text-foreground overflow-y-scroll
          ${nanumBarunGothic.variable} ${korailCondensed.variable} font-nanum-barun-gothic
          `}
      >
        <Header />
        <main className="flex flex-col py-16 w-full mx-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
