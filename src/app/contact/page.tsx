import { MainTitle } from "@/components/Title";
import generateMetadata from "@/lib/generateMetadata";

export const metadata = generateMetadata({
  title: "CONTACT - 99haus",
  description: "연락",
  currentPage: "contact",
});

export default function Contact() {
  return (
    <>
      <MainTitle title="CONTACT" subtitle="연락" />
      <article className="text-center h-full flex flex-col justify-center items-center">
        <a href="mailto:greenplanet1415@gmail.com" className="block my-8">
          greenplanet1415@gmail.com
        </a>
        <p>특별한 문의 사항이 있을 시 위의 이메일로 연락 부탁드리겠습니다.</p>
        <p className="uppercase text-sm">
          Please contact E-mail above for any questions
        </p>
      </article>
    </>
  );
}
