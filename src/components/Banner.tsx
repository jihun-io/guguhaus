// src/components/Banner.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import type { BannerItem } from "@/lib/notion"; // notion.ts에서 정의된 타입을 가져옵니다.

// Swiper 스타일 import
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

interface BannerProps {
  data: BannerItem[];
}

export function Banner({ data }: Readonly<BannerProps>) {
  if (!data || data.length === 0) {
    return null; // 데이터가 없으면 아무것도 렌더링하지 않습니다.
  }

  return (
    <section className="mb-16">
      <h2 className="sr-only">배너</h2>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0} // 슬라이드 사이 간격
        slidesPerView={1} // 한 번에 보여줄 슬라이드 수
        autoplay={{
          delay: 7000, // 7초마다 자동 넘김
          disableOnInteraction: false, // 사용자 상호작용 후에도 자동 넘김 유지
        }}
        pagination={{
          clickable: true, // 페이지네이션 버튼 클릭 가능
        }}
        navigation={true} // 이전/다음 버튼 표시
        loop={true} // 무한 루프
        className="mySwiper w-full " // 필요시 커스텀 스타일링을 위한 클래스
        style={
          {
            "--swiper-navigation-color": "#fff", // 내비게이션 버튼 색상
            "--swiper-pagination-color": "#fff", // 페이지네이션 색상
          } as React.CSSProperties
        }
      >
        {data.map((item, index) => (
          <SwiperSlide key={item.id}>
            <h3 className="sr-only">{item.title}</h3>{" "}
            <Link href={item.url} target="_blank" rel="noopener noreferrer">
              <img
                src={item.image}
                alt={item.imageAlt}
                width={1920} // 원본 이미지 너비 또는 최대 너비
                height={1080} // 원본 이미지 높이 또는 최대 높이
                sizes="100vw" // 뷰포트 너비에 따라 이미지 크기 조절
                className="w-full h-auto object-cover aspect-video" // 이미지 스타일
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
