import client from "@/lib/postgres";

export async function getBannerData() {
  const res = await client.query('SELECT * FROM banner ORDER BY "order" ASC');
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

export async function getMerchData() {
  const res = await client.query(
    'SELECT * FROM merchandise ORDER BY "order" ASC',
  );
  const rows = res.rows.map((row) => {
    return {
      createdAt: row.created_at,
      id: row.id,
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

export async function getHistoryData() {
  const res = await client.query("SELECT * FROM history ORDER BY date DESC");
  const rows = res.rows.map((row) => {
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
  });
  return rows;
}
