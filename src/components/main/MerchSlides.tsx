import { getMerchData } from "@/utils/getData";
import MerchSlidesClient from "./MerchSlidesClient";

// 서버 컴포넌트: 데이터 페칭만 담당
export default async function MerchSlides() {
  const merchData = await getMerchData();

  return <MerchSlidesClient merchData={merchData} />;
}
