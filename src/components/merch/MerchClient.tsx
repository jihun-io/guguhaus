"use client";

import { useEffect, useState } from "react";
import { MerchData } from "@/utils/getData";

export default function MerchClient({
  merchandises,
}: {
  merchandises: MerchData[];
}) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1); // '#' 제거
    setSelectedItem(hash || merchandises[0]?.postId || null);
  }, []);

  return (
    <section>
      <h2 className="uppercase font-bold text-3xl">Merchandise</h2>
      <div className="grid grid-cols-[auto_1fr] mt-6 gap-8">
        <nav>
          <ul className="flex flex-col gap-4">
            {merchandises.map((data) => (
              <li key={data.id}>
                <a
                  href={`#${data.postId}`}
                  className={`uppercase ${selectedItem === data.postId ? "font-bold" : ""}`}
                  onClick={() => setSelectedItem(data.postId)}
                >
                  {data.title} {data.titleEng}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <article className="flex w-full">
          {merchandises.map((data) => (
            <div
              key={data.id}
              className={`w-full grid grid-cols-1 sm:grid-cols-2 items-center justify-start gap-8 ${
                data.postId === selectedItem ? "block" : "hidden"
              }`}
            >
              {data.merchandiseItems.map((item) => (
                <div key={item.id} className={`w-full `}>
                  <div className="flex flex-col items-center">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="pb-2 aspect-[210/297] object-cover w-full"
                    />
                    <p className="font-bold">{item.title}</p>
                    <p>{item.titleEng}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}
