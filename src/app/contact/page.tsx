import { MainTitle } from "@/components/Title";

export const metadata = {
  title: "CONTACT - 99haus",
  description: "연락 방법",
};

export default function Contact() {
  return (
    <>
      <MainTitle title="CONTACT" subtitle="연락" />
      <article className="text-center h-full flex flex-col justify-center items-center">
        <a href="mailto:saeparandol@naver.com" className="block my-8">
          saeparandol@naver.com
        </a>
        <p>특별한 문의 사항이 있을 시 위의 이메일로 연락 부탁드리겠습니다.</p>
        <p className="uppercase">
          Please contact E-mail above for any questions
        </p>
      </article>
    </>
  );
}
