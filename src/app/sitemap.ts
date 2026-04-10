import type { MetadataRoute } from "next";
import { getHistoryData, getOriginalsData } from "@/utils/getData";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.URL!;
  const [works, originals] = await Promise.all([
    getHistoryData(),
    getOriginalsData(),
  ]);

  return [
    { url: baseUrl },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/originals` },
    { url: `${baseUrl}/participants` },
    { url: `${baseUrl}/merch` },
    ...works.map((item) => ({ url: `${baseUrl}/works/${item.postId}` })),
    ...originals.map((item) => ({ url: `${baseUrl}/originals/${item.postId}` })),
  ];
}