export default function NotFound() {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-lg text-gray-200">
        <span aria-hidden className="select-none">
          999999
        </span>
        <strong className="font-bold text-foreground">404</strong>
        <span aria-hidden className="select-none">
          999999
        </span>
      </h2>
      <p>페이지를 찾을 수 없습니다.</p>
    </section>
  );
}
