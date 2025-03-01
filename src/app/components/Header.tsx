import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-8">
      <h1>
        <Link href="/">
          <img src="/images/logo.svg" alt="99haus" className="w-40" />
        </Link>
      </h1>
      <nav>
        <ul className="flex gap-x-8 text-xl">
          <li>
            <Link href="#works">WORKS</Link>
          </li>
          <li>
            <Link href="#participants">PARTICIPANTS</Link>
          </li>
          <li>
            <Link href="#contact">CONTACT</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
