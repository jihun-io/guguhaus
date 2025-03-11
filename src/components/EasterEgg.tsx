"use client";

export default function EasterEgg() {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) return null;

  console.log(`
개발자 도구를 켜셨군요!
Developed by Jihun Kim
-----------------------
- https://dev.jihun.io
- https://github.com/jihun-io
- kim@jihun.io
`);
  return null;
}
