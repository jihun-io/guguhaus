export function MainTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <>
      <h2 className="text-3xl font-bold ">{title}</h2>
      <p className="text-xs">{subtitle}</p>
    </>
  );
}
