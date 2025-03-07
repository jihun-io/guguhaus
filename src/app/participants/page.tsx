export const runtime = "edge";
export const dynamic = "force-dynamic";

import { Participants } from "@/components/Cards";
import Loading from "@/components/Loading";
import { MainTitle } from "@/components/Title";
import { getParticipantsData } from "@/lib/notion";
import { Suspense } from "react";

export const metadata = {
  title: "PARTICIPANTS - 99haus",
  description: "프로젝트 참여자들을 소개합니다.",
};

async function ParticipantsContent() {
  const newArtistsData = await getParticipantsData();

  return <Participants artists={newArtistsData} />;
}

export default function ParticipantsPage() {
  return (
    <>
      <MainTitle title="PARTICIPANTS" subtitle="프로젝트 참여자들" />
      <Suspense fallback={<Loading />}>
        <ParticipantsContent />
      </Suspense>
    </>
  );
}
