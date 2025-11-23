"use client";

import Link from "next/link";
import { useState } from "react";

type HistoryData = {
  id: string;
  postId: string;
  thumbnail: string;
  imgAlt: string;
  title: string;
  titleEng: string;
  historyCategory: string;
  date: string;
};

function HistoryCard({
  id,
  postId,
  thumbnail,
  imgAlt,
  title,
  titleEng,
  historyCategory,
  date,
}: Readonly<HistoryData>) {
  return (
    <Link href={`/history/${postId}`} className="ml-auto mr-auto max-w-lg">
      <img src={thumbnail} alt={imgAlt} className="pb-3" />
      <p className="font-bold">{title}</p>
      <p className="uppercase">{titleEng}</p>
      <p>
        {historyCategory.replaceAll(",", ", ")}, {date.split("-")[0]}
      </p>
    </Link>
  );
}

export default function HistoryClient({
  historyData,
}: Readonly<{
  historyData: HistoryData[];
}>) {
  const [visibleCount, setVisibleCount] = useState(4);
  const hasMore = visibleCount < historyData.length;

  return (
    <section className="w-full flex flex-col gap-6">
      <h2 className="uppercase font-bold text-3xl">History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {historyData.slice(0, visibleCount).map((data) => (
          <HistoryCard key={data.id} {...data} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 2)}
          className="text-center py-2 px-4 border border-black hover:bg-black hover:text-white transition-colors"
        >
          더 보기
        </button>
      )}
    </section>
  );
}
