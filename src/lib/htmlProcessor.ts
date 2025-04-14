// lib/htmlProcessor.ts

// YouTube 비디오 ID 추출 함수
export const getYouTubeVideoId = (url: string): string | null => {
  // youtube.com 또는 youtu.be 링크 처리
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
};

// HTML 콘텐츠에서 YouTube 링크를 임베드로 변환
export const processYouTubeLinks = (htmlContent: string): string => {
  // DOMParser를 사용할 수 없으므로 정규식으로 처리
  // <a href="..." 패턴 찾기
  const linkRegex = /<p><a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a><\/p>/gi;

  // 모든 링크 태그 처리
  return htmlContent.replace(linkRegex, (match, href, text) => {
    // YouTube 링크인지 확인
    if (href.includes("youtube.com") || href.includes("youtu.be")) {
      const videoId = getYouTubeVideoId(href);

      if (videoId) {
        // YouTube 임베드로 교체
        return `
<div class="youtube-embed my-4">
<iframe
width="560"
height="315"
src="https://www.youtube.com/embed/${videoId}"
style="aspect-ratio: 16/9; width: 100%; height: 100%;"
title="${text || "YouTube video"}"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen
class="w-full aspect-video"
></iframe>
</div>
        `;
      }
    }

    // YouTube 링크가 아니면 원래 링크 반환
    return match;
  });
};

export const generateSrcset = (src: string, widths: number[]): string => {
  return widths
    .map((width) => {
      const srcWithWidth = `${src}&width=${width}`;
      return `${srcWithWidth} ${width}w`;
    })
    .join(", ");
};

// 이미지 태그의 srcset 속성을 업데이트하는 함수
export const updateImageSrcset = (htmlContent: string): string => {
  // img 태그의 src 속성을 찾기 위한 정규식
  const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;

  const widths = [640, 1080, 1920];

  // 모든 이미지 태그 처리
  return htmlContent.replace(imgRegex, (match, src) => {
    const srcset = generateSrcset(src, widths);
    // srcset 속성을 추가하여 이미지 태그를 업데이트함
    return match.replace(">", ` srcset="${srcset}" >`);
  });
};
