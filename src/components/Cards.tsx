import Link from "next/link";
import Image from "next/image";

interface CardProps {
  data: {
    title?: string;
    titleEng?: string;
    genre?: string;
    year?: string;
    href?: string;
    postId: string;
    image: string;
    imageAlt: string;
    desc?: string;
    category?: string;
    articleCategory?: string;
    historyCategory?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface ParticipantsProps {
  data: {
    image: string;
    imageAlt: string;
    artist: string;
    job: string;
    href: string;
  };
}

function Section({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <section
      className="prose 
    prose-p:text-foreground max-w-none prose-headings:text-foreground 
    prose-a:no-underline prose-a:text-foreground 
    w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 
    mb-16"
    >
      {children}
    </section>
  );
}

function H2({ children }: Readonly<{ children: React.ReactNode }>) {
  return <h2 className="col-span-full w-fit my-0">{children}</h2>;
}

function ComingSoon() {
  return <p className="col-span-full my-8">Coming soon...</p>;
}

export function WIPCard({ data }: Readonly<CardProps>) {
  return (
    <Link
      href={"wip/" + data.postId}
      className="flex flex-col w-fill h-fit leading-5"
    >
      <Image
        className="aspect-square object-cover w-full my-0"
        src={data.image}
        alt={data.imageAlt}
        width={480}
        height={480}
      />
      <h3 className="mt-2 my-0 leading-5">{data.title}</h3>
      <p className="my-0">
        {data.genre}, {data.year}
      </p>
    </Link>
  );
}

export function WorkInProgress({
  data,
}: Readonly<{ data: CardProps["data"][] }>) {
  console.log(data);
  return (
    <Section>
      <H2>WORK IN PROGRESS</H2>
      {data.length === 0 && <ComingSoon />}
      {data.length > 0 &&
        data.map((item) => <WIPCard key={item.title} data={item} />)}
    </Section>
  );
}

function ArticlesCard({ data }: Readonly<CardProps>) {
  return (
    <Link
      href={"articles/" + data.postId}
      className="relative w-full h-full aspect-square"
    >
      <h3 className="my-0 p-4 absolute top-0 right-0 font-outline-1 font-bold text-2xl">
        {data.title}
      </h3>
      <div className="absolute bottom-0 left-0 p-4">
        <p className="my-0 text-2xl font-bold font-outline-1">
          {data.articleCategory}
        </p>
        <p className="my-0 font-outline-base font-bold leading-4">
          {data.desc}
        </p>
      </div>
      <Image
        src={data.image}
        alt={data.imageAlt}
        width={480}
        height={480}
        className="w-full h-full object-cover my-0 absolute -z-10"
      />
    </Link>
  );
}

export function Articles({ data }: Readonly<{ data: CardProps["data"][] }>) {
  return (
    <Section>
      <H2>ARTICLES</H2>
      {data.length === 0 && <ComingSoon />}
      {data.length > 0 &&
        data.map((item) => <ArticlesCard key={item.title} data={item} />)}
    </Section>
  );
}

function HistoryCard({ data }: Readonly<CardProps>) {
  return (
    <Link href={"history/" + data.postId} className="w-full h-full">
      <Image
        src={data.image}
        alt={data.imageAlt}
        width={297}
        height={210}
        className="w-full object-cover  aspect-[210/297] my-0"
      />
      <h3 className="mt-2 mb-0 leading-6">{data.title}</h3>
      <p className="my-0 text-sm leading-4 uppercase">{data.titleEng}</p>
      <p className="mt-2 leading-5">
        {data.historyCategory}, {data.year}
      </p>
    </Link>
  );
}

export function History({ data }: Readonly<{ data: CardProps["data"][] }>) {
  return (
    <Section>
      <H2>HISTORY</H2>
      {data.length === 0 && <ComingSoon />}
      {data.length > 0 &&
        data.map((item) => <HistoryCard key={item.title} data={item} />)}
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
        className="w-full aspect-square object-cover"
      />
      <h3 className="my-0 leading-6">{data.artist}</h3>
      <p className="my-0 leading-6">{data.job}</p>
      <a
        href={data.href}
        target="_blank"
        className="text-sm my-0 not-prose underline"
      >
        @{data.href.split("/").reverse()[0]}
      </a>
    </article>
  );
}

export function Participants({
  artists,
}: Readonly<{ artists: ParticipantsProps["data"][] }>) {
  return (
    <Section>
      {artists.length === 0 && <ComingSoon />}
      {artists.length > 0 &&
        artists.map((item) => (
          <ParticipantsCard key={item.artist} data={item} />
        ))}
    </Section>
  );
}
