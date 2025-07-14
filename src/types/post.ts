export interface WipItem {
  id: string;
  postId: string;
  title: string;
  year: string;
  genre: string;
  image: string;
  imageAlt: string;
}

export interface WipDb {
  thumbnail: string;
  id: string;
  postid: string;
  title: string;
  year: string;
  genre: string;
  imagealt: string;
}

export interface ArticleItem {
  id: string;
  postId: string;
  title: string;
  describes: string;
  articleCategory: string;
  image: string;
  imageAlt: string;
}
export interface ArticleDb {
  id: string;
  postid: string;
  title: string;
  describes: string;
  articlecategory: string;
  thumbnail: string;
  imagealt: string;
}

export interface HistoryItem {
  id: string;
  postId: string;
  title: string;
  titleEng: string;
  date: string;
  historyCategory: string;
  image: string;
  imageAlt: string;
}
export interface HistoryDb {
  id: string;
  postid: string;
  title: string;
  titleeng: string;
  date: string;
  historycategory: string;
  thumbnail: string;
  imagealt: string;
}

export interface ParticipantsItem {
  id: string;
  artist: string;
  job: string;
  image: string;
  imageAlt: string;
  href: string;
}
export interface ParticipantsDb {
  id: string;
  artist: string;
  job: string;
  image: string;
  imagealt: string;
  href: string;
}

export interface PostTypes {
  properties: {
    id?: string;
    title: string;
    postId: string;
    category: "Work In Progress" | "Articles" | "History";
    createdAt?: string;
    content: string;
    updatedAt: string;
    thumbnail?: string;
    imageUrl?: string;
    imageAlt: string;
    // 기타 필드
    date?: string;
    year?: string;
    genre?: string;
    articleCategory?: string;
    historyCategory?: string;
    limitedCategory?: string;
    desc?: string;
    describes?: string;
    titleEng?: string;
    isDeleted?: boolean;
    createdTime: string;
  };
  htmlContent: string;
}

export interface PostDb {
  id?: string;
  title?: string;
  postid?: string;
  created_at?: string;
  htmlcontent?: string;
  updatedat?: string;
  thumbnail?: string;
  imageurl?: string;
  imagealt?: string;
  date?: string;
  year?: string;
  genre?: string;
  articlecategory?: string;
  historycategory?: string;
  desc?: string;
  describes?: string;
  titleeng?: string;
  isdeleted?: boolean;
}
