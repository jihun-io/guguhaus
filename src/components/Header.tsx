"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // 메뉴 항목을 배열로 정의하여 중복 코드 제거
  const menuItems = [
    { href: "/", label: "WORKS" },
    { href: "/participants", label: "PARTICIPANTS" },
    { href: "/contact", label: "CONTACT" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ESC 키로 메뉴 닫기 기능
  useEffect(() => {
    const handleEsc = (e: { key: string }) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <header className="z-50 px-4 py-8 sticky inset-x-0 top-0 bg-background flex justify-between items-center">
      <h1>
        <Link href="/" className="flex w-28">
          <img
            className="w-full"
            src="/images/logo.svg"
            alt="99haus"
            width={112}
            height={40}
          />
        </Link>
      </h1>
      {process.env.APP_ENVIRONMENT !== "production" && (
        <span className="font-korail-condensed">PREVIEW</span>
      )}

      <button
        onClick={toggleMenu}
        className="sm:hidden text-foreground z-50 p-2"
        aria-label="메뉴 열기/닫기"
        aria-expanded={isMenuOpen}
        aria-controls="main-nav"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 하나의 nav를 사용하여 반응형 처리 */}
      <nav
        id="main-nav"
        className={`
          h-fit
          sm:static sm:block
          fixed inset-0 bg-background
          transition-all duration-300 ease-in-out
          ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none sm:opacity-100 sm:translate-y-0 sm:pointer-events-auto"
          }
        `}
      >
        <ul
          className={`
          sm:flex sm:flex-row sm:gap-x-8 sm:p-0 sm:pt-0
          flex flex-col gap-y-8 p-8 pt-20 text-xl
        `}
        >
          {menuItems.map((item) => (
            <li key={item.href} className="font-korail-condensed">
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={
                  pathname === item.href
                    ? "font-bold"
                    : "hover:text-gray-500 transition-colors"
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
