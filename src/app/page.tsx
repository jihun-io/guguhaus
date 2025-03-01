import Image from "next/image";
import Link from "next/link";
import { Articles, History, WorkInProgress } from "./components/Cards";

const wipData = [
  {
    title: "THUMP!",
    genre: "다큐멘터리",
    year: "@2025",
    href: "/works/1",
    image: "/images/sample1.jpg",
    imageAlt: "sample 1",
    createdAt: "2021-10-01",
    updatedAt: "2021-10-01",
  },
  {
    title: "THUMP!",
    genre: "다큐멘터리",
    year: "@2025",
    href: "/works/1",
    image: "/images/sample1.jpg",
    imageAlt: "sample 1",
    createdAt: "2021-10-01",
    updatedAt: "2021-10-01",
  },
];

const articlesData = [
  {
    title: "유령서점",
    category: "InEar",
    desc: "한 번 잠잠했던 이들이 수면 위로 빼꼼히 올라오면",
    image: "/images/sample2.jpg",
    imageAlt: "sample 2",
    href: "works/3",
    createdAt: "2021-10-01",
    updatedAt: "2021-10-01",
  },
  {
    title: "ZIN CHOI",
    category: "InEar",
    desc: "마냥 귀엽게만 보지 말아주세요",
    image: "/images/sample3.jpg",
    imageAlt: "sample 3",
    href: "works/3",
    createdAt: "2021-10-01",
    updatedAt: "2021-10-01",
  },
  {
    title: "아무도 없는 숲속에서",
    category: "InSeat",
    desc: "지나가는 개구리가 반드시 듣고야 마는 그 소리",
    image: "/images/sample4.jpg",
    imageAlt: "sample 4",
    href: "works/3",
    createdAt: "2021-10-01",
    updatedAt: "2021-10-01",
  },
];

const historyData = [
  {
    title: "혹성의 아이",
    titleEng: "A Child From Green Planet",
    category: "단편, 영화, 패키지 구성",
    date: "2025-02-01",
    image: "/images/sample1.jpg",
    imageAlt: "sample 5",
    href: "/works/1",
    createdAt: "2025-03-02",
    updatedAt: "2025-03-02",
  },
  {
    title: "100% 유해한 그것",
    titleEng: "100% NOXIOUS THING",
    category: "단편, 영화, 패키지 구성",
    date: "2021-07-01",
    image: "/images/sample2.jpg",
    imageAlt: "sample 6",
    href: "/works/1",
    createdAt: "2025-03-02",
    updatedAt: "2025-03-02",
  },
  {
    title: "혹성의 아이 UNPLUGGED",
    titleEng: "A Child From Green Planet UNPLUGGED",
    category: "도서, 출판",
    date: "2025-02-01",
    image: "/images/sample3.jpg",
    imageAlt: "sample 7",
    href: "/works/1",
    createdAt: "2025-03-02",
    updatedAt: "2025-03-02",
  },
];

export default function Home() {
  return (
    <>
      <WorkInProgress data={wipData} />
      <Articles data={articlesData} />
      <History data={historyData} />
    </>
  );
}
