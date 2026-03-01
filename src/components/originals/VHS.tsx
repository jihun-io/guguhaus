export default function VHS({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="bg-[url('/images/vhs.png')] w-full max-w-[540px] h-[300px] bg-no-repeat bg-cover bg-center relative">
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 text-center">
        <p>{title}</p>
        <p>{subtitle}</p>
        {/*<p>asdf</p>*/}
      </div>
    </div>
  );
}
