export const runtime = "edge";
export const dynamic = "force-dynamic";

import { Articles, History, WorkInProgress } from "@/components/Cards";
import { Banner } from "@/components/Banner";
import { getBannerData, getData, notionDatabase } from "@/lib/notion";

import { getWipData, getArticlesData, getHistoryData } from "@/lib/supabase";

import { Suspense } from "react";
import generateMetadata from "@/lib/generateMetadata";

export const metadata = generateMetadata({});

async function Feeds() {
  // const bannerData = await getBannerData();
  const wipData = await getWipData();
  const articlesData = await getArticlesData();
  const historyData = await getHistoryData();

  return (
    <>
      {/*{bannerData && <Banner data={bannerData} />}*/}
      <WorkInProgress data={wipData} />
      <Articles data={articlesData} />
      <History data={historyData} />
    </>
  );
}

export default function Home() {
  return (
    <>
      <Feeds />
    </>
  );
}
