import Image from "next/image";

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center w-full mt-6 mb-12">
      <a href="/">
        <h1>
          <Image src="/images/Logo.svg" width={120} height={100} alt="99haus" />
        </h1>
      </a>
      <p className="font-bold text-sm">Live. Laugh. Love.</p>
    </header>
  );
}
