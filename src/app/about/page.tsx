import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section>
      <h2 className="uppercase font-bold text-3xl">About</h2>
      <p className="break-keep mt-[1em] mb-[2em]">
        구구하우스의 이름 아래 다음과 같은 것을 추구합니다
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-y-4 gap-x-8">
        <dt className="font-bold">Live, Laugh, Love</dt>
        <dd className="mb-4 flex flex-col gap-2">
          <p>
            영화, 만화, 소설, 논픽션, 매체를 가리지 않고 'Live, Laugh, Love' 세
            단어를 모토로 삼아 삶을 긍정하고, 때로는 소모적일지도 모르는 낭만과
            사랑의 이야기를 전합니다.
          </p>
          <p>
            Regardless of movies, cartoons, novels, nonfiction, and media, the
            three words "Live, Laugh, Love" are used as the motto to affirm life
            and tell the story of romance and love.
          </p>
        </dd>
        <dt className="font-bold">Visuals</dt>
        <dd className="mb-4 flex flex-col gap-2">
          <p>
            무엇이 어떻게 보여져야 하는가에 관심을 기울여, 사람들로 하여금
            흥미가 자극되고, 보고 싶게 만드는 작품을 지향합니다.
          </p>
          <p>
            Paying attention to what and how it should be seen, it aims at a
            work that stimulates people's interest and makes them want to see.
          </p>
        </dd>
        <dt className="font-bold">Contact Detail</dt>
        <dd className="mb-4 flex flex-col gap-2">
          <a href="https://instagram.com/wusyamotif" target="_blank">
            @wusyamotif
          </a>
          <a href="mailto:greenplanet1415@gmail.com">
            greenplanet1415@gmail.com
          </a>
        </dd>
      </dl>
    </section>
  );
}
