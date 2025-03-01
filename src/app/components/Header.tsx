"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // 메뉴 항목을 배열로 정의하여 중복 코드 제거
  const menuItems = [
    { href: "/works", label: "WORKS" },
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
    <header className="z-50 py-4 sticky inset-x-0 top-0 bg-background">
      <div className="flex justify-between items-center p-4 bg-background">
        <h1>
          <Link href="/" className="flex w-28">
            <Image
              src="/images/logo.svg"
              alt="99haus"
              width={112}
              height={28}
              priority
            />
          </Link>
        </h1>
        <button
          onClick={toggleMenu}
          className="sm:hidden text-foreground z-50 p-2"
          aria-label="메뉴 열기/닫기"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden sm:block">
          <ul className="flex gap-x-8 text-xl">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
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
      </div>

      {/* 모바일 메뉴 */}
      <nav
        id="mobile-menu"
        className={`h-fit sm:hidden fixed inset-0 bg-background transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
        aria-hidden={!isMenuOpen}
        role="menu"
      >
        <div className="flex flex-col h-fit">
          <ul className="flex flex-col gap-y-8 p-8 pt-20 text-xl">
            {menuItems.map((item) => (
              <li key={item.href} role="menuitem">
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
        </div>
      </nav>
    </header>
  );
}
