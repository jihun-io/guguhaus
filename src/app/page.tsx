export const runtime = "edge";
export const dynamic = "force-dynamic";

import { Articles, History, WorkInProgress } from "@/components/Cards";
import { adminDb } from "./lib/firebaseAdmin";
import {
  getArticlesData,
  getData,
  getHistoryData,
  getWipData,
  notionDatabase,
} from "@/lib/notion";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import generateMetadata from "@/lib/generateMetadata";

export const metadata = generateMetadata({});

async function Feeds() {
  const newWipData = await getWipData();
  const newArticlesData = await getArticlesData();
  const newHistoryData = await getHistoryData();

  return (
    <>
      <WorkInProgress data={newWipData} />
      <Articles data={newArticlesData} />
      <History data={newHistoryData} />
    </>
  );
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Feeds />
      </Suspense>
    </>
  );
}
