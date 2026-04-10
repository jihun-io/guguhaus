import type { Metadata } from "next";
import { getHistoryDetail } from "@/utils/getData";
import NotFound from "@/app/not-found";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;
  const data = await getHistoryDetail(postId);
  if (!data) return {};
  return {
    title: data.title,
    openGraph: {
      title: `${data.title} | 99haus`,
      images: [data.thumbnail],
    },
  };
}

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const data = await getHistoryDetail(postId);

  if (!data) {
    return <NotFound />;
  }

  return (
    <section>
      <h2 className="uppercase font-bold text-4xl">Works</h2>
      <article className="max-w-3xl mx-auto my-8">
        <div className="flex flex-col justify-center gap-2 mb-8">
          <img src={data.thumbnail} alt={data.imgAlt} className="w-4/6" />
          <h3 className="font-bold text-2xl">{data.title}</h3>
          <p className="uppercase">{data.titleEng}</p>
          <p>
            {data.historyCategory.replaceAll(",", ", ")},{" "}
            {data.date.split("-")[0]}
          </p>
        </div>
        <hr className="border-t border-hr my-8" />
        <div
          className="text-foreground prose max-w-full prose-li:prose-p:my-0 prose-h4:text-2xl prose-p:whitespace-pre-wrap prose-li:marker:text-black"
          dangerouslySetInnerHTML={{ __html: data.htmlContent }}
        ></div>
      </article>
    </section>
  );
}
