import { createClient } from "@supabase/supabase-js";
import {
  WipDb,
  WipItem,
  ArticleItem,
  ArticleDb,
  HistoryItem,
  HistoryDb,
  ParticipantsItem,
  ParticipantsDb,
  PostTypes,
  PostDb,
} from "@/types/post";

export const supabase = () => {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );
};

export async function getWipData() {
  const supabaseClient = supabase();
  try {
    const { data, error } = await supabaseClient
      .from("wip")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data?.map((item: WipDb) => {
      return {
        id: item.id,
        postId: item.postid,
        title: item.title,
        year: item.year,
        genre: item.genre,
        image: item.thumbnail,
        imageAlt: item.imagealt,
      } as WipItem;
    });
  } catch (error) {
    console.error("Error fetching WIP data:", error);
    return [];
  }
}

export async function getArticlesData() {
  const supabaseClient = supabase();
  try {
    const { data, error } = await supabaseClient
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data?.map((item: ArticleDb) => {
      return {
        id: item.id,
        postId: item.postid,
        title: item.title,
        desc: item.desc,
        articleCategory: item.articlecategory,
        image: item.thumbnail,
        imageAlt: item.imagealt,
      } as ArticleItem;
    });
  } catch (error) {
    console.error("Error fetching Articles data:", error);
    return [];
  }
}

export async function getHistoryData() {
  const supabaseClient = supabase();
  try {
    const { data, error } = await supabaseClient
      .from("history")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data?.map((item: HistoryDb) => {
      return {
        id: item.id,
        postId: item.postid,
        title: item.title,
        titleEng: item.titleeng,
        year: item.year,
        historyCategory: item.historycategory,
        image: item.thumbnail,
        imageAlt: item.imagealt,
      } as HistoryItem;
    });
  } catch (error) {
    console.error("Error fetching History data:", error);
    return [];
  }
}

export async function getContent({
  category,
  id,
}: {
  category: "wip" | "articles" | "history" | "limited";
  id: string;
}) {
  const supabaseClient = supabase();
  try {
    const { data, error } = await supabaseClient
      .from(category)
      .select("*")
      .eq("postid", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const result = data as PostDb;

    return {
      properties: {
        id: result.id,
        postId: result.postid,
        title: result.title,
        category:
          category === "wip"
            ? "Work In Progress"
            : category === "articles"
              ? "Articles"
              : category === "history"
                ? "History"
                : category === "limited"
                  ? "Limited"
                  : "",
        createdAt: result.created_at,
        content: result.htmlcontent,
        updatedAt: result.updatedat,
        thumbnail: result.thumbnail,
        imageUrl: result.thumbnail,
        imageAlt: result.imagealt,
        // 기타 필드
        date: result.date,
        genre: result.genre,
        year: result.year,
        createdTime: result.created_at,
        articleCategory: result.articlecategory,
        historyCategory: result.historycategory,
        desc: result.desc,
        titleEng: result.titleeng,
        isDeleted: result.isdeleted,
      },
      htmlContent: result.htmlcontent,
    } as PostTypes;
  } catch (error) {
    console.error(`Error fetching ${category} content:`, error);
    return null;
  }
}
