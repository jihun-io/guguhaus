export const runtime = "edge";
export const dynamic = "force-dynamic";

import { Participants } from "@/components/Cards";
import Loading from "@/components/Loading";
import { MainTitle } from "@/components/Title";
import generateMetadata from "@/lib/generateMetadata";
import { getParticipantsData } from "@/lib/supabase";
import { Suspense } from "react";

export const metadata = generateMetadata({
  title: "PARTICIPANTS - 99haus",
  description: "프로젝트 참여자들",
  currentPage: "participants",
});

async function ParticipantsContent() {
  const newArtistsData = await getParticipantsData();

  return <Participants artists={newArtistsData} />;
}

export default function ParticipantsPage() {
  return (
    <>
      <MainTitle title="PARTICIPANTS" subtitle="프로젝트 참여자들" />
      <ParticipantsContent />
    </>
  );
}
