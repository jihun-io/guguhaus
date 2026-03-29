export default function VHS({
  title,
  subtitle,
  period,
  vhsImage,
}: {
  title: string;
  subtitle: string;
  period: string;
  vhsImage: string;
}) {
  return (
    <div
      className="w-full max-w-[540px] h-[300px] bg-no-repeat bg-cover bg-center relative"
      style={{ backgroundImage: `url(${vhsImage})` }}
    >
      <div className="sr-only">
        <p>{title}</p>
        <p>{subtitle}</p>
        <p>{period}</p>
      </div>
    </div>
  );
}
