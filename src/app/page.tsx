import Image from "next/image";
import BannerSlides from "@/components/main/BannerSlides";
import MerchSlides from "@/components/main/MerchSlides";
import HistoryClient from "@/components/main/History";
import { getHistoryData } from "@/utils/getData";

export default async function Home() {
  const historyData = await getHistoryData();

  return (
    <main className="flex flex-col items-center justify-center w-full gap-16">
      <BannerSlides />
      <MerchSlides />
      <HistoryClient historyData={historyData} />
    </main>
  );
}
