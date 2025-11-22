import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center w-full my-6">
      <a href="/">
        <h1>
          <Image src="/images/Logo.svg" width={120} height={100} alt="99haus" />
        </h1>
        <p className="font-bold text-sm pb-6">Live. Laugh. Love.</p>
      </a>
      <nav className="w-full">
        <ul className="grid grid-cols-3 justify-centert justify-between font-bold">
          <li
            aria-label="Originals"
            className="text-xs sm:text-[1em] text-center uppercase"
          >
            <Link href="/originals">Ori9inals</Link>
          </li>
          <li className="text-xs sm:text-[1em] text-center uppercase">
            <Link href="/merch">Merch.</Link>
          </li>
          <li className="text-xs sm:text-[1em] text-center uppercase">
            <Link href="/participants">Participants</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
