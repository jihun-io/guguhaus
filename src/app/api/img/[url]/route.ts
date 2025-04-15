import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  const { url } = params;

  const imageUrl = url;

  if (!imageUrl) {
    return new NextResponse("Image URL is required", { status: 400 });
  }

  const NOTION_URL = process.env.NOTION_URL;
  if (!NOTION_URL) {
    return new NextResponse("NOTION_URL is not defined", { status: 500 });
  }

  // URL 검증
  if (!imageUrl.includes(NOTION_URL)) {
    return new NextResponse("Invalid image URL", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, {
        status: response.status,
      });
    }

    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // 응답 헤더 설정
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=86400"); // 24시간 캐싱

    return new NextResponse(imageData, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error proxying image:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
