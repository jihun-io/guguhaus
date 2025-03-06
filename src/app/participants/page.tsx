import { Participants } from "@/components/Cards";
import { MainTitle } from "@/components/Title";
import { adminDb } from "@/app/lib/firebaseAdmin";
import { getParticipantsData } from "@/lib/notion";

export const metadata = {
  title: "PARTICIPANTS - 99haus",
  description: "프로젝트 참여자들을 소개합니다.",
};

export default async function ParticipantsPage() {
  const newArtistsData = await getParticipantsData();

  return (
    <>
      <MainTitle title="PARTICIPANTS" subtitle="프로젝트 참여자들" />
      <Participants artists={newArtistsData} />
    </>
  );
}
