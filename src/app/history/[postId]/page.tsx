import { getHistoryData, getHistoryDetail } from "@/utils/getData";
import NotFound from "@/app/not-found";

export async function generateStaticParams() {
  const historyData = await getHistoryData();
  return historyData.map((data) => ({
    postId: data.postId,
  }));
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
      <h2 className="uppercase font-bold text-4xl">History</h2>
      <article className="max-w-3xl mx-auto my-8">
        <div className="flex flex-col justify-center gap-2 mb-8">
          <img src={data.thumbnail} alt={data.imgAlt} className="w-4/6" />
          <h3 className="font-bold text-2xl">{data.title}</h3>
          <p className="uppercase">{data.titleEng}</p>
          <p>
            {data.historyCategory}, {data.date.split("-")[0]}
          </p>
        </div>
        <hr className="border border-hr my-8" />
        <div
          className="prose max-w-full prose-li:prose-p:my-0 prose-h4:text-2xl"
          dangerouslySetInnerHTML={{ __html: data.htmlContent }}
        ></div>
      </article>
    </section>
  );
}
