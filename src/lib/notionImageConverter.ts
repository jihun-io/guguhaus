// notionImageConverter.ts

/**
 * 유효기간이 있는 노션 이미지 URL을 유효기간이 없는 URL로 변환합니다.
 * @param expiredUrl - 유효기간이 있는 노션 이미지 URL
 * @returns 유효기간이 없는 노션 이미지 URL
 */
export const convertToPermamentUrl = (
  expiredUrl: string,
  id: string
): string => {
  try {
    const encodedUrl = encodeURIComponent(expiredUrl.split("?")[0]);
    const notionUrl = process.env.NOTION_URL;

    return `${notionUrl}/image/${encodedUrl}?table=block&id=${id}&cache=v2`;
  } catch (error) {
    console.error("Error converting Notion image URL:", error);
    return expiredUrl; // 오류 발생 시 원본 URL 반환
  }
};
