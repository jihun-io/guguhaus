export const runtime = "edge";

import Loading from "@/components/Loading";
import PostArticle from "@/components/Posts";
import { getContent } from "@/lib/notion";
import Image from "next/image";
import { Suspense } from "react";

// 실제 콘텐츠를 가져오고 렌더링하는 컴포넌트
async function WipContent({ wipId }: { wipId: string }) {
  const wipContent = await getContent({ category: "wip", id: wipId });

  if (!wipContent || !wipContent.htmlContent) {
    return (
      <article className="h-full flex justify-center items-center">
        <p>해당 포스트를 찾을 수 없습니다.</p>
      </article>
    );
  }

  return (
    <>
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
    </>
  );
}

// 메인 페이지 컴포넌트
export default function WipPage({ params }: { params: { wipId: string } }) {
  const { wipId } = params;

  return (
    <section className="min-h-full">
      <Suspense fallback={<Loading />}>
        <WipContent wipId={wipId} />
      </Suspense>
    </section>
  );
}
