import { NotionAPI } from "notion-client";
import { Client } from "@notionhq/client";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { convertToPermamentUrl } from "./notionImageConverter";

export const notion = new NotionAPI();

export async function getData(rootPageId: string) {
  return await notion.getPage(rootPageId);
}

export const notionDatabase = new Client({
  auth: process.env.NOTION_SECRET,
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
