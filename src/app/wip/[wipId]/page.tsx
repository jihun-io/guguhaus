import PostArticle from "@/components/Posts";
import { getContent } from "@/lib/notion";
import Image from "next/image";
import React from "react";

export default async function WipPage({
  params,
}: {
  params: { wipId: string };
}) {
  const { wipId } = params;
  const wipContent = await getContent({ category: "wip", id: wipId });

  if (!wipContent || !wipContent.htmlContent) {
    return (
      <article className="h-full flex justify-center items-center">
        <p>해당 포스트를 찾을 수 없습니다.</p>
      </article>
    );
  }

  return (
    <section>
      <Image
        src={wipContent.properties.thumbnail}
        alt={wipContent.properties.imageAlt}
        width={480}
        height={480}
        className="aspect-square object-cover w-full max-w-[480px] my-2"
      />
      <h2 className="text-2xl">{wipContent.properties.title}</h2>
      <p className="">
        {wipContent.properties.genre}, {wipContent.properties.year}
      </p>
      <p>
        {new Date(wipContent.properties.createdTime).toLocaleString("ko-KR")}
      </p>
      <hr className="my-4" />

      <PostArticle content={wipContent.htmlContent} />
    </section>
  );
}
