export const runtime = "edge";
export const dynamic = "force-dynamic";

import Loading from "@/components/Loading";
import PostArticle from "@/components/Posts";
import { getContent } from "@/lib/notion";
import Image from "next/image";
import React, { Suspense } from "react";

async function HistoryContent({ historyId }: { historyId: string }) {
  const historyContent = await getContent({
    category: "history",
    id: historyId,
  });

  if (!historyContent || !historyContent.htmlContent) {
    return (
      <article className="h-full flex justify-center items-center">
        <p>해당 포스트를 찾을 수 없습니다.</p>
      </article>
    );
  }

  return (
    <>
      <img
        src={historyContent.properties.thumbnail}
        alt={historyContent.properties.imageAlt}
        width={480}
        height={480}
        className="aspect-[210/297] object-cover w-full max-w-[480px] my-2"
      />
      <h2 className="text-2xl">{historyContent.properties.title}</h2>
      <p>{historyContent.properties.titleEng}</p>
      <p>
        {historyContent.properties.historyCategory},{" "}
        {historyContent.properties.year}
      </p>
      <hr className="my-4" />

      <PostArticle content={historyContent.htmlContent} />
    </>
  );
}

export default function HistoryPage({
  params,
}: {
  params: { historyId: string };
}) {
  const { historyId } = params;

  return (
    <section className="min-h-full">
      <Suspense fallback={<Loading />}>
        <HistoryContent historyId={historyId} />
      </Suspense>
    </section>
  );
}
