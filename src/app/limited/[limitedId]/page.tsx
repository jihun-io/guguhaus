export const runtime = "edge";
export const dynamic = "force-dynamic";

import PostArticle, { PostLimitedArticle } from "@/components/Posts";
import { getContent } from "@/lib/notion";
import Image from "next/image";
import React from "react";
import { default as createMetadata } from "@/lib/generateMetadata";

export async function generateMetadata({
  params,
}: {
  params: { limitedId: string };
}) {
  const { limitedId } = params;

  const limitedContent = await getContent({
    category: "limited",
    id: limitedId,
  });

  if (!limitedContent || !limitedContent.properties) {
    return createMetadata({
      title: "99haus",
      description: "이야기가 시작되는 곳",
    });
  }

  return createMetadata({
    title: `${limitedContent.properties.title} - 99haus`,
    currentPage: `limited/${limitedId}`,
  });
}

async function LimitedContent({ limitedId }: { limitedId: string }) {
  const limitedContent = await getContent({
    category: "limited",
    id: limitedId,
  });

  if (!limitedContent || !limitedContent.htmlContent) {
    return (
      <article className="h-full flex justify-center items-center">
        <p>해당 포스트를 찾을 수 없습니다.</p>
      </article>
    );
  }

  return (
    <>
      <p className="font-korail-condensed text-xl">Limited Only</p>
      <h2 className="text-6xl my-4">{limitedContent.properties.title}</h2>
      <p className="font-korail-condensed">
        {limitedContent.properties.titleEng},{" "}
        {limitedContent.properties.limitedCategory},{" "}
        {limitedContent.properties.year}
      </p>
      <PostLimitedArticle content={limitedContent.htmlContent} />
    </>
  );
}

export default function LimitedPage({
  params,
}: {
  params: { limitedId: string };
}) {
  const { limitedId } = params;

  return (
    <section className="min-h-full">
      <LimitedContent limitedId={limitedId} />
    </section>
  );
}
