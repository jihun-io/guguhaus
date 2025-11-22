import client from "@/lib/postgres";

const isDev = process.env.APP_ENVIRONMENT === "dev";

export interface BannerData {
  createdAt: string;
  description: string;
  id: number;
  image: string;
  imageAlt: string;
  isShow: boolean;
  order: number;
  title: string;
  titleEng: string;
}

export interface MerchData {
  createdAt: string;
  id: number;
  postId: string;
  imageAlt: string;
  isShow: boolean;
  order: number;
  thumbnail: string;
  title: string;
  titleEng: string;
}

export interface HistoryData {
  createdAt: string;
  date: string;
  historyCategory: string;
  id: number;
  imgAlt: string;
  isShow: boolean;
  postId: string;
  thumbnail: string;
  title: string;
  titleEng: string;
  year: number;
}

export interface HistoryDetailData extends HistoryData {
  htmlContent: string;
}

export interface ParticipantData {
  createdAt: string;
  artist: string;
  description: string;
  href: string;
  htmlContent: string;
  id: number;
  image: string;
  imageAlt: string;
  job: string;
}

export async function getBannerData(): Promise<BannerData[]> {
  const res = await client.query(
    `SELECT * FROM banner WHERE ${isDev ? "TRUE" : "is_show = TRUE"} ORDER BY "order" ASC`,
  );
  const rows = res.rows.map((row) => {
    return {
      createdAt: row.created_at,
      description: row.description,
      id: row.id,
      image: row.image,
      imageAlt: row.image_alt,
      isShow: row.is_show,
      order: row.order,
      title: row.title,
      titleEng: row.title_eng,
    };
  });

  return rows;
}

export async function getMerchData(): Promise<MerchData[]> {
  const res = await client.query(
    `SELECT * FROM merchandise WHERE ${isDev ? "TRUE" : "is_show = TRUE"} ORDER BY "order" ASC`,
  );
  const rows = res.rows.map((row) => {
    return {
      createdAt: row.created_at,
      id: row.id,
      postId: row.post_id,
      imageAlt: row.image_alt,
      isShow: row.is_show,
      order: row.order,
      thumbnail: row.thumbnail,
      title: row.title,
      titleEng: row.title_eng,
    };
  });
  return rows;
}

export async function getHistoryData(): Promise<HistoryData[]> {
  const res = await client.query(
    `SELECT * FROM history WHERE ${isDev ? "TRUE" : "is_show = TRUE"} ORDER BY date DESC`,
  );
  const rows = res.rows.map((row) => {
    return {
      createdAt: row.created_at,
      date: row.date,
      historyCategory: row.history_category,
      id: row.id,
      imgAlt: row.img_alt,
      isShow: row.is_show,
      postId: row.post_id,
      thumbnail: row.thumbnail,
      title: row.title,
      titleEng: row.title_eng,
      year: row.year,
    };
  });
  return rows;
}

export async function getHistoryDetail(
  postId: string,
): Promise<HistoryDetailData | null> {
  const res = await client.query(
    `SELECT * FROM history WHERE post_id = $1 AND ${isDev ? "TRUE" : "is_show = TRUE"} LIMIT 1`,
    [postId],
  );
  const row = res.rows[0];
  if (!row) {
    return null;
  }
  return {
    createdAt: row.created_at,
    date: row.date,
    historyCategory: row.history_category,
    htmlContent: row.html_content,
    id: row.id,
    imgAlt: row.img_alt,
    isShow: row.is_show,
    postId: row.post_id,
    thumbnail: row.thumbnail,
    title: row.title,
    titleEng: row.title_eng,
    year: row.year,
  };
}

export async function getParticipantsData(): Promise<ParticipantData[]> {
  const res = await client.query(
    `SELECT * FROM participants ORDER BY "created_at" ASC`,
  );

  const rows = res.rows.map((row) => {
    return {
      createdAt: row.created_at,
      artist: row.artist,
      description: row.description,
      href: row.href,
      htmlContent: row.html_content,
      id: row.id,
      image: row.image,
      imageAlt: row.image_alt,
      job: row.job,
    };
  });

  return rows;
}
