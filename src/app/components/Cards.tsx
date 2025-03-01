import Link from "next/link";
import Image from "next/image";

interface CardProps {
  data: {
    title?: string;
    titleEng?: string;
    genre?: string;
    year?: string;
    href: string;
    image: string;
    imageAlt: string;
    desc?: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface ParticipantsProps {
  data: {
    image: string;
    imageAlt: string;
    artist: string;
    job: string;
    href: string;
    social: string;
  };
}

function Section({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="prose prose-p:text-foreground prose-headings:text-foreground prose-a:text-foreground w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
      {children}
    </section>
  );
}

function H2({ children }: Readonly<{ children: React.ReactNode }>) {
  return <h2 className="col-span-full w-fit my-0">{children}</h2>;
}

export function WIPCard({ data }: Readonly<CardProps>) {
  return (
    <Link href={data.href} className="flex flex-col w-fit h-fit">
      <Image
        className="aspect-square object-cover w-full my-0"
        src={data.image}
        alt={data.imageAlt}
        width={480}
        height={480}
      />
      <h3 className="my-0">{data.title}</h3>
      <p className="my-0">{data.genre}</p>
      <p className="my-0">@{new Date(data.createdAt).getFullYear()}</p>
    </Link>
  );
}

export function WorkInProgress({
  data,
}: Readonly<{ data: CardProps["data"][] }>) {
  return (
    <Section>
      <H2>WORK IN PROGRESS</H2>
      {data.map((item) => (
        <WIPCard key={item.title} data={item} />
      ))}
    </Section>
  );
}

function ArticlesCard({ data }: Readonly<CardProps>) {
  return (
    <Link href={data.href} className="relative w-full h-full aspect-square">
      <Image
        src={data.image}
        alt={data.imageAlt}
        width={480}
        height={480}
        className="w-full h-full object-cover my-0 absolute"
      />
      <h3 className="my-0 p-4 absolute top-0 right-0 font-outline-1 font-bold text-2xl">
        {data.title}
      </h3>
      <div className="absolute bottom-0 left-0 p-4">
        <p className="my-0 text-2xl font-bold font-outline-1">
          {data.category}
        </p>
        <p className="my-0 font-outline-base font-bold leading-4">
          {data.desc}
        </p>
      </div>
    </Link>
  );
}

export function Articles({ data }: Readonly<{ data: CardProps["data"][] }>) {
  return (
    <Section>
      <H2>ARTICLES</H2>
      {data.map((item) => (
        <ArticlesCard key={item.title} data={item} />
      ))}
    </Section>
  );
}

function HistoryCard({ data }: Readonly<CardProps>) {
  const year = new Date(data.createdAt).getFullYear();
  const month = new Date(data.createdAt).toLocaleDateString("en-US", {
    month: "2-digit",
  });
  return (
    <Link href={data.href} className="w-full h-full">
      <Image
        src={data.image}
        alt={data.imageAlt}
        width={297}
        height={210}
        className="w-full object-cover  aspect-[210/297] my-0"
      />
      <h3 className="my-2 leading-6">{data.title}</h3>
      <p className="my-2 leading-4">{data.titleEng}</p>
      <p className="my-0">{data.category}</p>
      <p className="my-0">
        @{year}
        {month}
      </p>
    </Link>
  );
}

export function History({ data }: Readonly<{ data: CardProps["data"][] }>) {
  return (
    <Section>
      <H2>HISTORY</H2>
      {data.map((item) => (
        <HistoryCard key={item.title} data={item} />
      ))}
    </Section>
  );
}

function ParticipantsCard({ data }: Readonly<ParticipantsProps>) {
  return (
    <article>
      <Image
        src={data.image}
        alt={data.imageAlt}
        width={480}
        height={480}
        className="w-full aspect-square object-cover "
      />
      <p className="my-0">{data.artist}</p>
      <p className="my-0">{data.job}</p>
      <a href={data.href} className="my-0">
        {data.social}
      </a>
    </article>
  );
}

export function Participants({
  artists,
}: Readonly<{ artists: ParticipantsProps["data"][] }>) {
  return (
    <Section>
      {artists.map((item) => (
        <ParticipantsCard key={item.artist} data={item} />
      ))}
    </Section>
  );
}
