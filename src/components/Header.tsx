import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center w-full my-6 mb-[4.36rem]">
      <a href="/">
        <h1>
          <Image
            src="/images/Logo-v2.svg"
            width={120}
            height={120}
            className="w-44 h-44"
            alt="99haus"
          />
        </h1>
        <p className="sr-only">Presents</p>
      </a>
      <nav className="w-full">
        <ul className="text-[0.9rem] grid grid-cols-4 justify-centert justify-between font-bold">
          <li aria-label="Originals" className="text-center uppercase">
            <Link href="/originals">Ori9inals</Link>
          </li>
          <li className="text-center uppercase">
            <Link href="/merch">Merch.</Link>
          </li>
          <li className="text-center uppercase">
            <Link href="/participants">Participants</Link>
          </li>
          <li className="text-center uppercase">
            <Link href="/about">About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
