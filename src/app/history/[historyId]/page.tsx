export const runtime = "edge";
export const dynamic = "force-dynamic";

import Loading from "@/components/Loading";
import PostArticle from "@/components/Posts";
import { getContent } from "@/lib/supabase";
import Image from "next/image";
import React, { Suspense } from "react";
import { default as createMetadata } from "@/lib/generateMetadata";

export async function generateMetadata({
  params,
}: {
  params: { historyId: string };
}) {
  const { historyId } = params;

  const articleContent = await getContent({
    category: "history",
    id: historyId,
  });

  if (!articleContent || !articleContent.properties) {
    return createMetadata({
      title: "99haus",
      description: "이야기가 시작되는 곳",
    });
  }

  return createMetadata({
    title: `${articleContent.properties.title} - 99haus`,
    ogImageUrl: articleContent.properties.thumbnail,
    currentPage: `history/${historyId}`,
  });
}

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
        sizes="(max-width: 480px) 100vw, 480px"
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
      <HistoryContent historyId={historyId} />
    </section>
  );
}
