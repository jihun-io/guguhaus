export default function AboutPage() {
  return (
    <section>
      <h2 className="uppercase font-bold text-3xl">About</h2>
      <p className="break-keep mb-4">
        구구하우스의 이름 아래 다음과 같은 것을 추구합니다
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-y-4 gap-x-8">
        <dt className="font-bold">Live, Laugh, Love</dt>
        <dd className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque nemo
          nesciunt obcaecati provident temporibus, ut voluptatum. Animi
          architecto dolore dolores illo ipsam mollitia nostrum quis quisquam,
          quos recusandae, suscipit voluptates?
        </dd>
        <dt className="font-bold">Visuals</dt>
        <dd className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut commodi
          dolor eligendi, error et minus modi nulla officiis quae quo!
        </dd>
        <dt className="font-bold">Contact Detail</dt>
        <dd className="mb-4">
          특별한 문의사항이 있을 시에는{" "}
          <a href="mailto:greenplanet1415@gmail.com">
            greenplanet1415@gmail.com
          </a>
          으로 연락 부탁드리겠습니다.
        </dd>
      </dl>
    </section>
  );
}
