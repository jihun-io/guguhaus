import { Articles, History, WorkInProgress } from "@/components/Cards";
import { adminDb } from "./lib/firebaseAdmin";
import {
  getArticlesData,
  getData,
  getHistoryData,
  getWipData,
  notionDatabase,
} from "@/lib/notion";

export default async function Home() {
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
