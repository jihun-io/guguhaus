"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import Link from "next/link";

type BannerData = {
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  titleEng: string;
  description: string;
};

// 클라이언트 컴포넌트: Swiper UI만 담당
export default function BannerSlidesClient({
  bannerData,
}: {
  bannerData: BannerData[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="w-full relative">
      <div className="relative">
        <h2
          className="absolute left-0 uppercase font-bold text-3xl z-10"
          style={{ top: "calc(((min(100vw, 768px) - 1rem) * 9 / 16))" }}
        >
          Now <br />
          Presenting
        </h2>
        <Swiper
          key={mounted ? "banner-swiper" : "loading"}
          modules={[Scrollbar, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          scrollbar={{ draggable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          style={{ width: "100%", maxWidth: "100%", paddingBottom: "1rem" }}
        >
          {bannerData.map((data) => (
            <SwiperSlide key={data.id} style={{ width: "100%" }}>
              <Link href={`/banner/${data.id}`} className="block w-full">
                <article className="w-full flex flex-col items-start justify-start gap-3.5">
                  <img
                    className="aspect-video w-full object-cover mb-20"
                    src={data.image}
                    alt={data.imageAlt}
                  />
                  <p className="font-bold text-2xl">
                    {data.title} <br />
                    {data.titleEng}
                  </p>
                  <p>{data.description}</p>
                </article>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
