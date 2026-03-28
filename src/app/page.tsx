import Image from "next/image";
import BannerSlides from "@/components/main/BannerSlides";
import MerchSlides from "@/components/main/MerchSlides";
import WorksClient from "@/components/main/Works";
import { getHistoryData } from "@/utils/getData";

export default async function Home() {
  const historyData = await getHistoryData();

  return (
    <main className="flex flex-col items-center justify-center w-full gap-16">
      <BannerSlides />
      <MerchSlides />
      <WorksClient historyData={historyData} />
    </main>
  );
}
