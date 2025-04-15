export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const encodedSrc = encodeURIComponent(src);
  return `/api/img/${encodedSrc}&width=${width}`;
}
