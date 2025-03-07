export const runtime = "edge";
export const dynamic = "force-dynamic";

import Loading from "@/components/Loading";
import PostArticle from "@/components/Posts";
import { getContent } from "@/lib/notion";
import Image from "next/image";
import React, { Suspense } from "react";

async function ArticlesContent({ articleId }: { articleId: string }) {
  const articleContent = await getContent({
    category: "articles",
    id: articleId,
  });

  if (!articleContent || !articleContent.htmlContent) {
    return (
      <article className="h-full flex justify-center items-center">
        <p>해당 포스트를 찾을 수 없습니다.</p>
      </article>
    );
  }

  return (
    <section>
      <img
        src={articleContent.properties.thumbnail}
        alt={articleContent.properties.imageAlt}
        width={480}
        height={480}
        className="aspect-square object-cover w-full max-w-[480px] my-2"
      />
      <h2 className="text-2xl">{articleContent.properties.title}</h2>
      <p>{articleContent.properties.category}</p>
      <p>{articleContent.properties.desc}</p>
      <p>
        {new Date(articleContent.properties.createdTime).toLocaleString(
          "ko-KR"
        )}
      </p>
      <hr className="my-4" />

      <PostArticle content={articleContent.htmlContent} />
    </section>
  );
}

export default function ArticlesPage({
  params,
}: {
  params: { articleId: string };
}) {
  const { articleId } = params;

  return (
    <section className="min-h-full">
      <Suspense fallback={<Loading />}>
        <ArticlesContent articleId={articleId} />
      </Suspense>
    </section>
  );
}
