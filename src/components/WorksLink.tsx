"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

function scrollToWorks() {
  const el = document.getElementById("works");
  if (el) {
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY,
      behavior: "smooth",
    });
  }
}

export default function WorksLink() {
  const pathname = usePathname();
  const router = useRouter();
  const shouldScroll = useRef(false);

  useEffect(() => {
    if (shouldScroll.current && pathname === "/") {
      shouldScroll.current = false;
      setTimeout(scrollToWorks, 150);
    }
  }, [pathname]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (pathname === "/") {
      scrollToWorks();
    } else {
      shouldScroll.current = true;
      router.push("/", { scroll: false });
    }
  };

  return (
    <a href="/" onClick={handleClick}>
      Works
    </a>
  );
}
