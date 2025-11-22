"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import Link from "next/link";

type MerchData = {
  id: string;
  postId: string;
  thumbnail: string;
  imageAlt: string;
  title: string;
  titleEng: string;
};

// 클라이언트 컴포넌트: Swiper UI만 담당
export default function MerchSlidesClient({
  merchData,
}: {
  merchData: MerchData[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="w-full flex flex-col gap-4">
      <h2 className="uppercase font-bold text-3xl">Merchandise</h2>
      <Swiper
        key={mounted ? "merch-swiper" : "loading"}
        modules={[Scrollbar, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        className="w-full"
        scrollbar={{ draggable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        style={{ width: "100%", maxWidth: "100%", paddingBottom: "1rem" }}
      >
        {merchData.map((data) => (
          <SwiperSlide key={data.id} style={{ width: "100%" }}>
            <Link
              href={`/merch/${data.postId}`}
              key={data.id}
              className="block w-full"
            >
              <article className="flex flex-col items-center justify-start font-bold gap-4">
                <img
                  src={data.thumbnail}
                  alt={data.imageAlt}
                  className="aspect-[4/3] w-full h-64 object-contain"
                />
                <div className="text-center">
                  <p>{data.title}</p>
                  <p className="uppercase">{data.titleEng}</p>
                </div>
              </article>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
