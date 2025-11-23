import { getBannerData, getBannerImagesData } from "@/utils/getData";
import BannerSlidesClient from "./BannerSlidesClient";

// 서버 컴포넌트: 데이터 페칭만 담당
export default async function BannerSlides() {
  const bannerData = await getBannerData();
  const bannerImagesData = await getBannerImagesData(bannerData[0].id);

  return (
    <BannerSlidesClient
      bannerData={bannerData[0]}
      bannerImagesData={bannerImagesData}
    />
  );
}
