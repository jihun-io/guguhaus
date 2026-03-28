"use client";

import Link from "next/link";
import { useState } from "react";

type WorksData = {
  id: string;
  postId: string;
  thumbnail: string;
  imgAlt: string;
  title: string;
  titleEng: string;
  historyCategory: string;
  date: string;
};

function WorksCard({
  id,
  postId,
  thumbnail,
  imgAlt,
  title,
  titleEng,
  historyCategory,
  date,
}: Readonly<WorksData>) {
  return (
    <Link href={`/history/${postId}`} className="ml-auto mr-auto">
      <img
        src={thumbnail}
        alt={imgAlt}
        className="pb-3 aspect-210/297 object-contain"
      />
      <p className="font-bold text-lg">{title}</p>
      <p className="uppercase">{titleEng}</p>
      <p>
        {historyCategory.replaceAll(",", ", ")}, {date.split("-")[0]}
      </p>
    </Link>
  );
}

export default function WorksClient({
  historyData,
}: Readonly<{
  historyData: WorksData[];
}>) {
  const [visibleCount, setVisibleCount] = useState(4);
  const hasMore = visibleCount < historyData.length;

  return (
    <section id="works" className="w-full flex flex-col">
      <h2 className="uppercase font-bold text-xl mb-[2.181818rem]">Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2.181818rem] px-17.5">
        {historyData.slice(0, visibleCount).map((data) => (
          <WorksCard key={data.id} {...data} />
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
