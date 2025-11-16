import Image from "next/image";

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center w-full my-6">
      <h1>
        <Image src="/images/Logo.svg" width={120} height={100} alt="99haus" />
      </h1>
      <p className="font-bold text-sm">Live. Laugh. Love.</p>
    </header>
  );
}
