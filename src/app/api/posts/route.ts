import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/app/lib/firebaseAdmin";
import { getServerSession } from "next-auth";
import sharp from "sharp";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  CollectionReference,
  DocumentData,
  Query,
} from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    let id: string | null = null;
    if (formData.has("id")) {
      id = formData.get("id") as string;
    }

    const category = formData.get("category") as string;
    const postId = formData.get("postId") as string;
    const originalPostId = (formData.get("originalPostId") as string) || null; // 수정 시 원래 postId
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageAlt = formData.get("imageAlt") as string;
    const date = formData.get("date") as string;

    const now = new Date().toISOString();

    // 기본 데이터
    let postData: any = {
      title,
      postId,
      content,
      imageAlt,
      date,
      category,
      updatedAt: now,
    };

    // 카테고리별 특수 필드
    if (category === "Work In Progress") {
      postData.genre = formData.get("genre") as string;
    } else if (category === "Articles") {
      postData.articleCategory = formData.get("articleCategory") as string;
      postData.desc = formData.get("desc") as string;
    } else if (category === "History") {
      postData.titleEng = formData.get("titleEng") as string;
      postData.historyCategory = formData.get("historyCategory") as string;
    }

    // 이미지 파일 처리
    let imageFile: File | null = null;
    let imageUrl = formData.get("imageUrl") as string;

    if (formData.has("imageFile")) {
      const file = formData.get("imageFile");
      if (file instanceof File && file.size > 0) {
        imageFile = file;
      }
    }

    // 이미지 처리 및 업로드
    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const resizedImage = await sharp(buffer)
        .resize({ width: 1200, fit: "inside" })
        .webp({ quality: 80 })
        .toBuffer();

      // 이미지 파일명에 postId와 타임스탬프 포함
      const fileName = `posts/${category}/${postId}-${now
        .replace(/:/g, "-")
        .replace(/\..+$/, "")}.webp`;

      const imageRef = adminStorage.bucket().file(fileName);
      await imageRef.save(resizedImage);
      await imageRef.makePublic();

      imageUrl = `https://storage.googleapis.com/${imageRef.bucket.name}/${imageRef.name}`;
      postData.imageUrl = imageUrl;
    } else if (imageUrl) {
      postData.imageUrl = imageUrl;
    }

    // 모든 포스트는 'posts' 컬렉션에 저장
    const collectionName = "posts";
    const postsCollection = adminDb.collection(collectionName);

    // 데이터베이스에 저장
    if (id) {
      // 기존 문서 업데이트

      // postId 변경 확인
      if (originalPostId && originalPostId !== postId) {
        // postId가 변경되었으므로 중복 검사
        const existingPostIdDoc = await postsCollection
          .where("postId", "==", postId)
          .get();

        if (!existingPostIdDoc.empty) {
          return NextResponse.json(
            { message: "이미 사용 중인 포스트 ID입니다." },
            { status: 400 }
          );
        }
      }

      // 문서 업데이트
      await postsCollection.doc(id).update(postData);
      return NextResponse.json({
        message: "포스트가 수정되었습니다",
        id,
        postId,
      });
    } else {
      // 새 문서 생성

      // postId 중복 검사
      const existingDoc = await postsCollection
        .where("postId", "==", postId)
        .get();

      if (!existingDoc.empty) {
        return NextResponse.json(
          { message: "이미 사용 중인 포스트 ID입니다." },
          { status: 400 }
        );
      }

      // 생성 시간 추가
      postData.createdAt = now;

      // 자동 생성 ID로 문서 생성
      const docRef = await postsCollection.add(postData);
      return NextResponse.json({
        message: "포스트가 추가되었습니다",
        id: docRef.id,
        postId,
      });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "오류가 발생했습니다", error: (e as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const postId = searchParams.get("postId");
    const id = searchParams.get("id");

    // 컬렉션은 항상 'posts'
    const collectionName = "posts";
    const postsCollection = adminDb.collection(collectionName);

    // 문서 ID로 조회
    if (id) {
      const doc = await postsCollection.doc(id).get();

      if (!doc.exists) {
        return NextResponse.json(
          { message: "포스트를 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: doc.id,
        ...doc.data(),
      });
    }

    // postId로 조회
    if (postId) {
      const snapshot = await postsCollection
        .where("postId", "==", postId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return NextResponse.json(
          { message: "포스트를 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      const doc = snapshot.docs[0];
      return NextResponse.json({
        id: doc.id,
        ...doc.data(),
      });
    }

    let query: CollectionReference<DocumentData> | Query<DocumentData> =
      postsCollection;

    // 카테고리 필터링
    if (category) {
      query = query.where("category", "==", category);
    }

    // 최신순으로 정렬
    query = query.orderBy("createdAt", "desc");

    const snapshot = await query.get();
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      content: undefined, // 내용은 제외
    }));

    return NextResponse.json(posts);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID가 필요합니다" }, { status: 400 });
    }

    // 모든 포스트는 'posts' 컬렉션에서 삭제
    const collectionName = "posts";

    await adminDb.collection(collectionName).doc(id).delete();

    return NextResponse.json({ message: "포스트가 삭제되었습니다" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
