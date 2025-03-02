import { Participants } from "@/components/Cards";
import { MainTitle } from "@/components/Title";

export const metadata = {
  title: "PARTICIPANTS - 99haus",
  description: "프로젝트 참여자들을 소개합니다.",
};

const artistData = [
  {
    artist: "뚱이 PATRICK",
    job: "배우",
    social: "@대충인스타아이디",
    href: "https://instagram.com/대충인스타아이디",
    image: "/images/sample1.jpg",
    imageAlt: "sample 1",
  },
  {
    artist: "스폰지밥 SPONGEBOB",
    job: "배우",
    social: "@대충인스타아이디",
    href: "https://instagram.com/대충인스타아이디",
    image: "/images/sample2.jpg",
    imageAlt: "sample 2",
  },
];

export default function ParticipantsPage() {
  return (
    <>
      <MainTitle title="PARTICIPANTS" subtitle="프로젝트 참여자들" />
      <Participants artists={artistData} />
    </>
  );
}
