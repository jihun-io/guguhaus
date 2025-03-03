export interface PostTypes {
  id?: string;
  title: string;
  postId: string;
  category: "Work In Progress" | "Articles" | "History";
  createdAt?: string;
  content: string;
  updatedAt: string;
  image?: string;
  imageUrl?: string;
  imageAlt: string;
  // 기타 필드
  date?: string;
  genre?: string;
  articleCategory?: string;
  historyCategory?: string;
  desc?: string;
  titleEng?: string;
  isDeleted?: boolean;
}
