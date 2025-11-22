import { getParticipantsData } from "@/utils/getData";

export default async function ParticipantsPage() {
  const participantsData = await getParticipantsData();

  return (
    <section>
      <h2 className="uppercase font-bold text-3xl">Participants</h2>
      <p>구구하우스 프로젝트에 참여했던 고마운 분들을 소개합니다</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {participantsData.map((participant) => (
          <article key={participant.id} className="my-4">
            <a href={participant.href} className="flex flex-col items-center">
              <img
                className="h-48 object-cover mb-4"
                src={participant.image}
                alt={participant.imageAlt}
              />
              <p>{participant.description}</p>
              <p className="">{participant.job}</p>
              <p className="font-bold">{participant.artist}</p>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
