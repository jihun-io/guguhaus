export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const NOTION_URL = "https://button-reminder-1c5.notion.site";
  if (!NOTION_URL) {
    throw new Error("NOTION_URL is not defined");
  }

  const filteredSrc = src.replace(NOTION_URL, "");

  const encodedSrc = encodeURIComponent(filteredSrc);

  return `/api/img/${encodedSrc}?width=${width}`;
}
