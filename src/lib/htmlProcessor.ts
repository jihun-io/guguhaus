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
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;

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
