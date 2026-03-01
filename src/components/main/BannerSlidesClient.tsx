"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import { BannerData, BannerImagesData } from "@/utils/getData";

// 클라이언트 컴포넌트: Swiper UI만 담당
export default function BannerSlidesClient({
  bannerData,
  bannerImagesData,
}: {
  bannerData: BannerData;
  bannerImagesData: BannerImagesData[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="w-full relative">
      <article className="w-full flex flex-col items-start justify-start gap-3.5">
        <Swiper
          key={mounted ? "banner-swiper" : "loading"}
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          style={{ width: "100%", maxWidth: "100%", paddingBottom: "1rem" }}
        >
          {bannerImagesData.map((data) => (
            <SwiperSlide key={data.id} style={{ width: "100%" }}>
              <img
                className="aspect-video w-full object-cover"
                src={data.image}
                alt={data.imageAlt}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <h2 className="uppercase font-bold text-xl leading-[1.2]">
          Now <br />
          Presenting
        </h2>
        <p className="font-bold text-lg leading-[1.2]">
          {bannerData.title} <br />
          {bannerData.titleEng}
        </p>
        <p className="break-keep leading-[1.2]">{bannerData.description}</p>
      </article>
    </section>
  );
}
