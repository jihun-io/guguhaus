import { Articles, History, WorkInProgress } from "@/components/Cards";
import { adminDb } from "./lib/firebaseAdmin";

interface Post {
  id: string;
  title: string;
  postId: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
  // 기타 필드
  date?: string;
  genre?: string;
  articleCategory?: string;
  historyCategory?: string;
  desc?: string;
  titleEng?: string;
}

export default async function Home() {
  const wipData: Post[] = [];
  const articlesData: Post[] = [];
  const historyData: Post[] = [];

  const totalData = await adminDb
    .collection("posts")
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .filter((doc) => doc.data().isDeleted === false)
        .map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            title: data.title,
            category: data.category,
            desc: data.desc,
            genre: data.genre,
            articleCategory: data.articleCategory,
            historyCategory: data.historyCategory,
            titleEng: data.titleEng,
            image: data.imageUrl,
            imageAlt: data.imageAlt,
            postId: data.postId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            content: undefined,
          };
        });
    });

  totalData.forEach((item) => {
    if (item.category === "Work In Progress") {
      wipData.push(item);
    } else if (item.category === "Articles") {
      articlesData.push(item);
    } else if (item.category === "History") {
      historyData.push(item);
    }
  });

  return (
    <>
      <WorkInProgress data={wipData} />
      <Articles data={articlesData} />
      <History data={historyData} />
    </>
  );
}
