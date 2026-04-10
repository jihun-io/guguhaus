import type { Metadata } from "next";
import Link from "next/link";
import VHS from "@/components/originals/VHS";
import { getOriginalsData } from "@/utils/getData";

export const metadata: Metadata = { title: "Ori9inals" };

export const dynamic = "force-dynamic";

export default async function OriginalsPage() {
  const originalsData = await getOriginalsData();

  return (
    <section>
      <h2 className="uppercase font-bold text-3xl" aria-label="Originals">
        Ori9inals
      </h2>
      <p className="uppercase">Limited Only</p>
      <p className="break-keep mb-4">
        구구하우스에서 제작한 오리지널 콘텐츠를 소개합니다.
      </p>

      <div className="flex flex-col gap-8">
        {originalsData.map((item) => (
          <Link key={item.id} href={`/originals/${item.postId}`}>
            <VHS
              title={item.title}
              subtitle={item.titleEng}
              period={item.workPeriod ?? ""}
              vhsImage={item.tapeImage ?? ""}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
