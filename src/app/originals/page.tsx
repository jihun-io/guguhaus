import VHS from "@/components/originals/VHS";

export default function OriginalsPage() {
  return (
    <section>
      <h2 className="uppercase font-bold text-3xl" aria-label="Originals">
        Ori9inals
      </h2>
      <p className="uppercase">Limited Only</p>
      <p className="break-keep mb-4">
        구구하우스에서 제작한 오리지널 콘텐츠를 소개합니다.
      </p>

      <VHS title="혹성의 아이" subtitle="A Child From Green Planet" />
    </section>
  );
}
