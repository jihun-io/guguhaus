import client from "@/lib/postgres";

const isDev = process.env.APP_ENVIRONMENT === "dev";

export interface BannerData {
  createdAt: string;
  description: string;
  id: string;
  isShow: boolean;
  title: string;
  titleEng: string;
}

export interface BannerImagesData {
  bannerId: string;
  id: string;
  image: string;
  imageAlt: string;
  order: number;
}

export interface MerchData {
  createdAt: string;
  id: string;
  postId: string;
  imageAlt: string;
  isShow: boolean;
  order: number;
  thumbnail: string;
  title: string;
  titleEng: string;
  merchandiseItems: MerchItem[];
}

export interface MerchItem {
  id: string;
  merchandiseId: string;
  isShow: boolean;
  image: string;
  imageAlt: string;
  title: string;
  titleEng: string;
}

export interface HistoryData {
  createdAt: string;
  date: string;
  historyCategory: string;
  id: string;
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
  id: string;
  image: string;
  imageAlt: string;
  job: string;
}

export async function getBannerData(): Promise<BannerData[]> {
  const res = await client.query(
    `SELECT * FROM banner WHERE ${isDev ? "TRUE" : "is_show = TRUE"}`,
  );
  return res.rows.map((row) => {
    return {
      createdAt: row.created_at,
      description: row.description,
      id: row.id,
      isShow: row.is_show,
      title: row.title,
      titleEng: row.title_eng,
    };
  });
}

export async function getBannerImagesData(
  bannerId: string,
): Promise<BannerImagesData[]> {
  const res = await client.query(
    `SELECT * FROM banner_images WHERE banner_id = $1 ORDER BY "order" ASC`,
    [bannerId],
  );
  return res.rows.map((row) => {
    return {
      bannerId: row.banner_id,
      id: row.id,
      image: row.image,
      imageAlt: row.image_alt,
      order: row.order,
    };
  });
}

export async function getMerchData(): Promise<MerchData[]> {
  const res = await client.query(
    `SELECT 
      m.*,
      mi.id as item_id,
      mi.is_show as item_is_show,
      mi.image as item_image,
      mi.image_alt as item_image_alt,
      mi.title as item_title,
      mi.title_eng as item_title_eng
    FROM merchandise m
    LEFT JOIN merchandise_items mi ON m.id = mi.merchandise_id
    WHERE ${isDev ? "TRUE" : "m.is_show = TRUE AND (mi.is_show = TRUE OR mi.is_show IS NULL)"}
    ORDER BY m.order ASC`,
  );

  // Map을 사용하여 merchandise와 그에맞는 merchandise items를 그룹화
  const merchMap = new Map<string, MerchData>();

  res.rows.forEach((row) => {
    if (!merchMap.has(row.id)) {
      merchMap.set(row.id, {
        createdAt: row.created_at,
        id: row.id,
        postId: row.post_id,
        imageAlt: row.image_alt,
        isShow: row.is_show,
        order: row.order,
        thumbnail: row.thumbnail,
        title: row.title,
        titleEng: row.title_eng,
        merchandiseItems: [],
      });
    }

    if (row.item_id) {
      merchMap.get(row.id)!.merchandiseItems.push({
        id: row.item_id,
        merchandiseId: row.id,
        isShow: row.item_is_show,
        image: row.item_image,
        imageAlt: row.item_image_alt,
        title: row.item_title,
        titleEng: row.item_title_eng,
      });
    }
  });

  return Array.from(merchMap.values());
}

export async function getMerchItemsData(): Promise<MerchItem[]> {
  const res = await client.query(
    `SELECT * FROM merchandise_items WHERE ${isDev ? "TRUE" : "m.is_show = TRUE"}`,
  );
  return res.rows.map((row) => {
    return {
      id: row.id,
      merchandiseId: row.merchandise_id,
      isShow: row.is_show,
      image: row.image,
      imageAlt: row.image_alt,
      title: row.title,
      titleEng: row.title_eng,
    };
  });
}

export async function getHistoryData(): Promise<HistoryData[]> {
  const res = await client.query(
    `SELECT * FROM history WHERE ${isDev ? "TRUE" : "is_show = TRUE"} ORDER BY date DESC`,
  );
  return res.rows.map((row) => {
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

export interface OriginalsData {
  id: string;
  postId: string;
  title: string;
  titleEng: string;
  tapeImage: string | null;
  workPeriod: string | null;
  category: string;
  isShow: boolean;
  createdAt: string;
}

export async function getOriginalsData(): Promise<OriginalsData[]> {
  const res = await client.query(
    `SELECT * FROM originals WHERE ${isDev ? "TRUE" : "is_show = TRUE"} ORDER BY work_period DESC, created_at DESC`,
  );
  return res.rows.map((row) => ({
    id: row.id,
    postId: row.post_id,
    title: row.title,
    titleEng: row.title_eng,
    tapeImage: row.tape_image,
    workPeriod: row.work_period,
    category: row.category,
    isShow: row.is_show,
    createdAt: row.created_at,
  }));
}

export async function getParticipantsData(): Promise<ParticipantData[]> {
  const res = await client.query(
    `SELECT * FROM participants ORDER BY "created_at" ASC`,
  );

  return res.rows.map((row) => {
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
}
