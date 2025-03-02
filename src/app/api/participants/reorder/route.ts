import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { message: "유효하지 않은 데이터 형식입니다" },
        { status: 400 }
      );
    }

    // Firestore 배치 업데이트 준비
    const batch = adminDb.batch();

    // 각 항목의 순서 업데이트
    items.forEach((item) => {
      if (!item.id) return;

      const docRef = adminDb.collection("participants").doc(item.id);
      batch.update(docRef, { order: item.order });
    });

    // 배치 실행
    await batch.commit();

    return NextResponse.json({ message: "순서가 업데이트되었습니다" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
