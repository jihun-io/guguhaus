import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/app/lib/firebaseAdmin";
import { getServerSession } from "next-auth";
import sharp from "sharp";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

    const artist = formData.get("artist") as string;
    const job = formData.get("job") as string;
    const social = formData.get("social") as string;
    const href = formData.get("href") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const order = formData.has("order")
      ? parseInt(formData.get("order") as string)
      : 0; // order 필드 추가

    let imageFile: File | null = null;

    if (formData.has("imageFile")) {
      const file = formData.get("imageFile");
      if (file instanceof File && file.size > 0) {
        imageFile = file;
      }
    }

    const imageAlt = formData.get("imageAlt") as string;

    let generatedImageUrl: string = imageUrl;

    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const resizedImage = await sharp(buffer)
        .resize({ width: 640, height: 640, fit: "cover" })
        .webp()
        .toBuffer();

      // 이미지 업로드
      const imageRef = adminStorage
        .bucket()
        .file(
          `participants/${artist}${new Date()
            .toISOString()
            .replace(/:/g, "-")
            .replace(/\..+$/, "")}.webp`
        );
      await imageRef.save(resizedImage);

      await imageRef.makePublic();

      generatedImageUrl = `https://storage.googleapis.com/${imageRef.bucket.name}/${imageRef.name}`;
    }

    // 데이터베이스에 저장
    if (id) {
      await adminDb.collection("participants").doc(id).set({
        artist,
        job,
        social,
        href,
        imageUrl: generatedImageUrl,
        imageAlt,
        order, // order 필드 추가
      });
      return NextResponse.json({ message: "참여자가 수정되었습니다" });
    }

    await adminDb.collection("participants").add({
      artist,
      job,
      social,
      href,
      imageUrl: generatedImageUrl,
      imageAlt,
      order, // order 필드 추가
    });

    return NextResponse.json({ message: "참여자가 추가되었습니다" });
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

    // URL 객체를 사용하여 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID가 제공되지 않았습니다" },
        { status: 400 }
      );
    }

    await adminDb.collection("participants").doc(id).delete();

    return NextResponse.json({ message: "참여자가 삭제되었습니다" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const snapshot = await adminDb.collection("participants").get();
    const participants = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(participants);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
