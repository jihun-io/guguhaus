import { Participants } from "@/components/Cards";
import { MainTitle } from "@/components/Title";
import { adminDb } from "@/app/lib/firebaseAdmin";

export const metadata = {
  title: "PARTICIPANTS - 99haus",
  description: "프로젝트 참여자들을 소개합니다.",
};

interface Artist {
  image: string;
  imageAlt: string;
  artist: string;
  job: string;
  href: string;
  social: string;
}

export default async function ParticipantsPage() {
  const artistData = await adminDb
    .collection("participants")
    .orderBy("order")
    .get()
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          artist: data.artist,
          job: data.job,
          social: data.social,
          href: data.href,
          image: data.imageUrl,
          imageAlt: data.imageAlt,
        } as Artist;
      });
    });

  return (
    <>
      <MainTitle title="PARTICIPANTS" subtitle="프로젝트 참여자들" />
      <Participants artists={artistData} />
    </>
  );
}
