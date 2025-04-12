export const runtime = "edge";
export const dynamic = "force-dynamic";

import Loading from "@/components/Loading";
import PostArticle from "@/components/Posts";
import { getContent } from "@/lib/notion";
import Image from "next/image";
import React, { Suspense } from "react";
import { default as createMetadata } from "@/lib/generateMetadata";

export async function generateMetadata({
  params,
}: {
  params: { articleId: string };
}) {
  const { articleId } = params;

  const articleContent = await getContent({
    category: "articles",
    id: articleId,
  });

  if (!articleContent || !articleContent.properties) {
    return createMetadata({
      title: "99haus",
      description: "이야기가 시작되는 곳",
    });
  }

  return createMetadata({
    title: `${articleContent.properties.title} - 99haus`,
    description: articleContent.properties.desc,
    ogImageUrl: articleContent.properties.thumbnail,
    currentPage: `articles/${articleId}`,
  });
}

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
      <Image
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
        {new Date(articleContent.properties.createdTime).toLocaleDateString(
          "ko-KR",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          }
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
    <Suspense fallback={<Loading />}>
      <section className="min-h-full">
        <ArticlesContent articleId={articleId} />
      </section>
    </Suspense>
  );
}
