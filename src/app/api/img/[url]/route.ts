export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { url: string } },
) {
  const { url } = params;
  const imageUrl = url;

  // URL 검증
  if (!imageUrl) {
    return new NextResponse("Image URL is required", { status: 400 });
  }

  const NOTION_URL = process.env.NOTION_URL;
  if (!NOTION_URL) {
    return new NextResponse("NOTION_URL is not defined", { status: 500 });
  }

  if (!imageUrl.includes(NOTION_URL)) {
    return new NextResponse("Invalid image URL", { status: 400 });
  }

  try {
    // 쿼리 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const width = searchParams.get("width");

    // 원본 URL 디코딩
    let fetchUrl = decodeURI(imageUrl);

    // width 파라미터가 있으면 Notion 이미지 URL에 추가
    if (width) {
      // URL 객체 생성
      const origUrl = new URL(fetchUrl);
      // 기존 파라미터 유지하면서 width 파라미터 추가
      origUrl.searchParams.set("width", width);
      fetchUrl = origUrl.toString();
    }

    const response = await fetch(fetchUrl);

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, {
        status: response.status,
      });
    }

    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=86400");

    return new NextResponse(imageData, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error proxying image:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
