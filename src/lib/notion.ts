import { NotionAPI } from "notion-client";
import { Client } from "@notionhq/client";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { convertToPermamentUrl } from "./notionImageConverter";
import { NotionToMarkdown } from "notion-to-md";

import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";
import { processYouTubeLinks, updateImageSrcset } from "./htmlProcessor";

export const notion = new NotionAPI();

export async function getData(rootPageId: string) {
  return await notion.getPage(rootPageId);
}

export const notionDatabase = new Client({
  auth: process.env.NOTION_SECRET,
});

export const n2m = new NotionToMarkdown({
  notionClient: notionDatabase,
});

// WIP 데이터 인터페이스 정의
export interface WipItem {
  id: string;
  postId: string;
  title: string;
  year: string;
  genre: string;
  image: string;
  imageAlt: string;
}

export async function getWipData(): Promise<WipItem[]> {
  const wipId = process.env.NOTION_WIP_ID;

  if (!wipId) {
    throw new Error("WIP_ID is not defined");
  }

  const wipDb = await notionDatabase.databases.query({
    database_id: wipId,
  });

  return wipDb.results
    .filter((item): item is PageObjectResponse => "properties" in item)
    .map((page) => {
      // 필요한 속성이 존재하는지 확인
      const urlPath = page.properties["URL 경로"];
      const title = page.properties["이름"];
      const year = page.properties["연도"];
      const genre = page.properties["장르"];
      const thumbnail = page.properties["섬네일"];
      const imageAlt = page.properties["섬네일 대체 텍스트"];
      const isShow = page.properties["배포"];

      // 타입 가드와 안전한 접근
      if (
        urlPath?.type !== "rich_text" ||
        !urlPath.rich_text[0]?.plain_text ||
        title?.type !== "title" ||
        !title.title[0]?.plain_text ||
        genre?.type !== "rich_text" ||
        !genre.rich_text[0]?.plain_text ||
        thumbnail?.type !== "files" ||
        !thumbnail.files[0] ||
        !("file" in thumbnail.files[0]) ||
        imageAlt?.type !== "rich_text" ||
        !imageAlt.rich_text[0]?.plain_text ||
        isShow?.type !== "checkbox"
      ) {
        throw new Error(`필수 속성이 누락되었습니다: ${page.id}`);
      }

      if (!isShow.checkbox) {
        return null;
      }

      return {
        id: page.id,
        postId: urlPath.rich_text[0].plain_text,
        title: title.title[0].plain_text,
        year: year?.type === "number" ? year.number?.toString() || "" : "",
        genre: genre.rich_text[0].plain_text,
        image: convertToPermamentUrl(thumbnail.files[0].file.url, page.id),
        imageAlt: imageAlt.rich_text[0].plain_text,
      };
    })
    .filter((item): item is WipItem => item !== null);
}

// 아티클 데이터 인터페이스 정의
export interface ArticleItem {
  id: string;
  postId: string;
  title: string;
  desc: string;
  articleCategory: string;
  image: string;
  imageAlt: string;
}

export async function getArticlesData(): Promise<ArticleItem[]> {
  const articlesId = process.env.NOTION_ARTICLES_ID;

  if (!articlesId) {
    throw new Error("ARTICLES_ID is not defined");
  }

  const articlesDb = await notionDatabase.databases.query({
    database_id: articlesId,
  });

  return articlesDb.results
    .filter((item): item is PageObjectResponse => "properties" in item)
    .map((page) => {
      // 필요한 속성이 존재하는지 확인
      const urlPath = page.properties["URL 경로"];
      const title = page.properties["이름"];
      const desc = page.properties["설명"];
      const category = page.properties["카테고리"];
      const thumbnail = page.properties["섬네일"];
      const imageAlt = page.properties["섬네일 대체 텍스트"];
      const isShow = page.properties["배포"];

      // 타입 가드와 안전한 접근
      if (
        urlPath?.type !== "rich_text" ||
        !urlPath.rich_text[0]?.plain_text ||
        title?.type !== "title" ||
        !title.title[0]?.plain_text ||
        desc?.type !== "rich_text" ||
        !desc.rich_text[0]?.plain_text ||
        category?.type !== "select" ||
        !category.select?.name ||
        thumbnail?.type !== "files" ||
        !thumbnail.files[0] ||
        !("file" in thumbnail.files[0]) ||
        imageAlt?.type !== "rich_text" ||
        !imageAlt.rich_text[0]?.plain_text ||
        isShow?.type !== "checkbox"
      ) {
        throw new Error(`필수 속성이 누락되었습니다: ${page.id}`);
      }

      if (!isShow.checkbox) {
        return null;
      }

      return {
        id: page.id,
        postId: urlPath.rich_text[0].plain_text,
        title: title.title[0].plain_text,
        desc: desc.rich_text[0].plain_text,
        articleCategory: category.select.name,
        image: convertToPermamentUrl(thumbnail.files[0].file.url, page.id),
        imageAlt: imageAlt.rich_text[0].plain_text,
      };
    })
    .filter((item): item is ArticleItem => item !== null);
}

// 히스토리 데이터 인터페이스 정의
export interface HistoryItem {
  id: string;
  postId: string;
  title: string;
  titleEng: string;
  year: string;
  historyCategory: string;
  image: string;
  imageAlt: string;
}

export async function getHistoryData(): Promise<HistoryItem[]> {
  const historyId = process.env.NOTION_HISTORY_ID;

  if (!historyId) {
    throw new Error("HISTORY_ID is not defined");
  }

  const historyDb = await notionDatabase.databases.query({
    database_id: historyId,
  });

  return historyDb.results
    .filter((item): item is PageObjectResponse => "properties" in item)
    .map((page) => {
      // 필요한 속성이 존재하는지 확인
      const urlPath = page.properties["URL 경로"];
      const title = page.properties["이름"];
      const titleEng = page.properties["영제"];
      const year = page.properties["연도"];
      const genre = page.properties["장르"];
      const thumbnail = page.properties["섬네일"];
      const imageAlt = page.properties["섬네일 대체 텍스트"];
      const isShow = page.properties["배포"];

      // 타입 가드와 안전한 접근
      if (
        urlPath?.type !== "rich_text" ||
        !urlPath.rich_text[0]?.plain_text ||
        title?.type !== "title" ||
        !title.title[0]?.plain_text ||
        titleEng?.type !== "rich_text" ||
        !titleEng.rich_text[0]?.plain_text ||
        genre?.type !== "multi_select" ||
        thumbnail?.type !== "files" ||
        !thumbnail.files[0] ||
        !("file" in thumbnail.files[0]) ||
        imageAlt?.type !== "rich_text" ||
        !imageAlt.rich_text[0]?.plain_text ||
        isShow?.type !== "checkbox"
      ) {
        throw new Error(`필수 속성이 누락되었습니다: ${page.id}`);
      }

      if (!isShow.checkbox) {
        return null;
      }

      return {
        id: page.id,
        postId: urlPath.rich_text[0].plain_text,
        title: title.title[0].plain_text,
        titleEng: titleEng.rich_text[0].plain_text,
        year: year?.type === "number" ? year.number?.toString() || "" : "",
        historyCategory: genre.multi_select.map((item) => item.name).join(", "),
        image: convertToPermamentUrl(thumbnail.files[0].file.url, page.id),
        imageAlt: imageAlt.rich_text[0].plain_text,
      };
    })
    .filter((item): item is HistoryItem => item !== null);
}

export interface ParticipantsItem {
  id: string;
  artist: string;
  job: string;
  image: string;
  imageAlt: string;
  href: string;
}

export async function getParticipantsData(): Promise<ParticipantsItem[]> {
  const participantsId = process.env.NOTION_PARTICIPANTS_ID;

  if (!participantsId) {
    throw new Error("PARTICIPANTS_ID is not defined");
  }

  const participantsDb = await notionDatabase.databases.query({
    database_id: participantsId,
  });

  return participantsDb.results
    .filter((item): item is PageObjectResponse => "properties" in item)
    .map((page) => {
      // 필요한 속성이 존재하는지 확인
      const artist = page.properties["이름"];
      const job = page.properties["직업"];
      const thumbnail = page.properties["프로필 사진"];
      const imageAlt = page.properties["프로필 사진 대체 텍스트"];
      const urlPath = page.properties["URL"];
      const isShow = page.properties["배포"];

      // 타입 가드와 안전한 접근
      if (
        artist?.type !== "title" ||
        !artist.title[0]?.plain_text ||
        job?.type !== "multi_select" ||
        thumbnail?.type !== "files" ||
        !thumbnail.files[0] ||
        !("file" in thumbnail.files[0]) ||
        imageAlt?.type !== "rich_text" ||
        !imageAlt.rich_text[0]?.plain_text ||
        urlPath?.type !== "url" ||
        !urlPath.url ||
        isShow?.type !== "checkbox"
      ) {
        throw new Error(`필수 속성이 누락되었습니다: ${page.id}`);
      }

      if (!isShow.checkbox) {
        return null;
      }

      return {
        id: page.id,
        artist: artist.title[0].plain_text,
        job: job.multi_select.map((item) => item.name).join(", "),
        image: convertToPermamentUrl(thumbnail.files[0].file.url, page.id),
        imageAlt: imageAlt.rich_text[0].plain_text,
        href: urlPath.url,
      };
    })
    .filter((item): item is ParticipantsItem => item !== null);
}

// 타입 가드 함수 추가
function isPageObjectResponse(obj: any): obj is PageObjectResponse {
  return obj && "properties" in obj;
}

// 체크박스 속성인지 확인하는 타입 가드 함수
function isCheckboxProperty(
  property: any
): property is { type: "checkbox"; checkbox: boolean; id: string } {
  return (
    property &&
    property.type === "checkbox" &&
    typeof property.checkbox === "boolean"
  );
}

export async function getContent({
  category,
  id,
}: {
  category: "wip" | "articles" | "history";
  id: string;
}) {
  // id는 페이지의 영문 경로
  // 영문 경로를 가진 페이지의 ID를 먼저 가져옵니다.
  try {
    let dbId: string | undefined;

    switch (category) {
      case "wip":
        dbId = process.env.NOTION_WIP_ID;
        break;
      case "articles":
        dbId = process.env.NOTION_ARTICLES_ID;
        break;
      case "history":
        dbId = process.env.NOTION_HISTORY_ID;
        break;
    }

    if (!dbId) {
      throw new Error(`${category.toUpperCase()}_ID is not defined`);
    }

    const db = await notionDatabase.databases.query({
      database_id: dbId,
    });

    const pageDoc = db.results.find((page) => {
      // properties가 있는지 확인
      if (!("properties" in page) || !page.properties) {
        return false;
      }

      const typedPage = page as PageObjectResponse;
      const urlPath = typedPage.properties["URL 경로"];

      // urlPath가 rich_text 타입인지 확인
      if (urlPath?.type !== "rich_text") {
        return false;
      }

      // rich_text 배열이 존재하고 비어있지 않은지 확인
      if (!Array.isArray(urlPath.rich_text) || urlPath.rich_text.length === 0) {
        return false;
      }

      // plain_text가 존재하고 id와 일치하는지 확인
      return urlPath.rich_text[0].plain_text === id;
    });

    if (!pageDoc) {
      throw new Error(`Page not found: ${id}`);
    }

    if (!isPageObjectResponse(pageDoc)) {
      throw new Error("Page is not a PageObjectResponse");
    }

    const properties = pageDoc.properties;

    if (!properties || !properties["배포"]) {
      throw new Error("Page does not have properties or is not published");
    }

    const deployProperty = properties["배포"];
    if (!isCheckboxProperty(deployProperty) || !deployProperty.checkbox) {
      throw new Error("Page is not published");
    }

    const pageId = pageDoc.id;

    // 생성 일시와 최종 편집 일시 가져오기
    const createdTime = pageDoc.created_time;
    const lastEditedTime = pageDoc.last_edited_time;

    // 카테고리별 추가 속성 추출
    let categorySpecificProperties: any = {};

    switch (category) {
      case "wip":
        categorySpecificProperties = extractWipProperties(properties, pageId);
        break;
      case "articles":
        categorySpecificProperties = extractArticleProperties(
          properties,
          pageId
        );
        break;
      case "history":
        categorySpecificProperties = extractHistoryProperties(
          properties,
          pageId
        );
        break;
    }

    const mdBlocks = await n2m.pageToMarkdown(pageId);

    // 이미지 변환
    const imgProcessedMdBlocks = mdBlocks.map((block) => {
      if (block.type === "image") {
        // 정규식 매칭 결과가 null일 수 있으므로 안전하게 처리
        const imageUrlMatch = block.parent.match(/\(([^)]+)\)/);
        const altTextMatch = block.parent.match(/\[([^)]+)\]/);

        if (
          !imageUrlMatch ||
          !imageUrlMatch[1] ||
          !altTextMatch ||
          !altTextMatch[1]
        ) {
          // 매칭 실패 시 원래 블록 반환
          return block;
        }

        const imageLink = imageUrlMatch[1];
        const altText = altTextMatch[1];
        const convertedImageLink = convertToPermamentUrl(
          imageLink,
          block.blockId
        );

        return {
          type: "image",
          blockId: block.blockId,
          parent: `![${altText}](${convertedImageLink})`,
          children: [],
        };
      }

      return block;
    });

    // 제목 1을 h3, 제목 2를 h4, 제목 3을 h5로 변환
    const convertedMdBlocks = imgProcessedMdBlocks.map((block) => {
      if (block.type === "heading_1") {
        return {
          type: "heading_3",
          blockId: block.blockId,
          parent: "##" + block.parent,
          children: block.children,
        };
      } else if (block.type === "heading_2") {
        return {
          type: "heading_4",
          blockId: block.blockId,
          parent: "##" + block.parent,
          children: block.children,
        };
      } else if (block.type === "heading_3") {
        return {
          type: "heading_5",
          blockId: block.blockId,
          parent: "##" + block.parent,
          children: block.children,
        };
      }

      return block;
    });

    const escapeHtmlLike = (content: string): string => {
      // 모든 < 와 > 문자를 HTML 엔티티로 변환
      return content.replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
    };

    const mdContent = n2m.toMarkdownString(convertedMdBlocks).parent;
    const escapedMdContent = escapeHtmlLike(mdContent);

    const htmlContent = await unified()
      .use(markdown)
      .use(remark2rehype)
      .use(html)
      .process(escapedMdContent);

    console.log("htmlContent", htmlContent);

    // YouTube 링크 처리
    const ytbProcessedContent = processYouTubeLinks(htmlContent.toString());
    const srcProcessedContent = updateImageSrcset(ytbProcessedContent);

    return {
      properties: {
        ...categorySpecificProperties,
        createdTime,
        lastEditedTime,
      },
      htmlContent: srcProcessedContent,
    };
  } catch (error) {
    console.error("getContent error:", error);
    return;
  }
}

// WIP 속성 추출 함수
function extractWipProperties(properties: any, pageId: string) {
  try {
    const title =
      properties["이름"]?.type === "title"
        ? properties["이름"].title[0]?.plain_text || ""
        : "";

    const year =
      properties["연도"]?.type === "number"
        ? properties["연도"].number?.toString() || ""
        : "";

    const genre =
      properties["장르"]?.type === "rich_text"
        ? properties["장르"].rich_text[0]?.plain_text || ""
        : "";

    const thumbnail =
      properties["섬네일"]?.type === "files" &&
      properties["섬네일"].files[0] &&
      "file" in properties["섬네일"].files[0]
        ? convertToPermamentUrl(properties["섬네일"].files[0].file.url, pageId)
        : "";

    const imageAlt =
      properties["섬네일 대체 텍스트"]?.type === "rich_text"
        ? properties["섬네일 대체 텍스트"].rich_text[0]?.plain_text || ""
        : "";

    return {
      title,
      year,
      genre,
      thumbnail,
      imageAlt,
    };
  } catch (error) {
    console.error("Error extracting WIP properties:", error);
    return {};
  }
}

// 아티클 속성 추출 함수
function extractArticleProperties(properties: any, pageId: string) {
  try {
    const title =
      properties["이름"]?.type === "title"
        ? properties["이름"].title[0]?.plain_text || ""
        : "";

    const desc =
      properties["설명"]?.type === "rich_text"
        ? properties["설명"].rich_text[0]?.plain_text || ""
        : "";

    const category =
      properties["카테고리"]?.type === "select"
        ? properties["카테고리"].select?.name || ""
        : "";

    const thumbnail =
      properties["섬네일"]?.type === "files" &&
      properties["섬네일"].files[0] &&
      "file" in properties["섬네일"].files[0]
        ? convertToPermamentUrl(properties["섬네일"].files[0].file.url, pageId)
        : "";

    const imageAlt =
      properties["섬네일 대체 텍스트"]?.type === "rich_text"
        ? properties["섬네일 대체 텍스트"].rich_text[0]?.plain_text || ""
        : "";

    return {
      title,
      desc,
      category,
      thumbnail,
      imageAlt,
    };
  } catch (error) {
    console.error("Error extracting Article properties:", error);
    return {};
  }
}

// 히스토리 속성 추출 함수
function extractHistoryProperties(properties: any, pageId: string) {
  try {
    const title =
      properties["이름"]?.type === "title"
        ? properties["이름"].title[0]?.plain_text || ""
        : "";

    const titleEng =
      properties["영제"]?.type === "rich_text"
        ? properties["영제"].rich_text[0]?.plain_text || ""
        : "";

    const year =
      properties["연도"]?.type === "number"
        ? properties["연도"].number?.toString() || ""
        : "";

    const genre =
      properties["장르"]?.type === "multi_select"
        ? properties["장르"].multi_select
            .map((item: any) => item.name)
            .join(", ")
        : "";

    const thumbnail =
      properties["섬네일"]?.type === "files" &&
      properties["섬네일"].files[0] &&
      "file" in properties["섬네일"].files[0]
        ? convertToPermamentUrl(properties["섬네일"].files[0].file.url, pageId)
        : "";

    const imageAlt =
      properties["섬네일 대체 텍스트"]?.type === "rich_text"
        ? properties["섬네일 대체 텍스트"].rich_text[0]?.plain_text || ""
        : "";

    return {
      title,
      titleEng,
      year,
      historyCategory: genre,
      thumbnail,
      imageAlt,
    };
  } catch (error) {
    console.error("Error extracting History properties:", error);
    return {};
  }
}
