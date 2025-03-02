import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";
import { hash } from "bcryptjs";

export async function POST(request: NextRequest) {
  const serviceStateDoc = await adminDb
    .collection("pageState")
    .doc("admin")
    .get();

  if (!serviceStateDoc.exists) {
    return NextResponse.json(
      { message: "가입이 불가능한 상태입니다" },
      { status: 400 }
    );
  }

  const serviceState = serviceStateDoc.data();

  if (!serviceState) {
    return NextResponse.json(
      { message: "가입이 불가능한 상태입니다" },
      { status: 400 }
    );
  }

  const { isJoinAvailable, joinCode } = serviceState;

  if (!isJoinAvailable) {
    return NextResponse.json(
      { message: "가입이 불가능한 상태입니다" },
      { status: 400 }
    );
  }

  const { username, userId, password, inviteCode } = await request.json();

  if (!username || !userId || !password || !inviteCode) {
    return NextResponse.json(
      { message: "모든 필드를 입력해주세요" },
      { status: 400 }
    );
  }

  if (inviteCode !== joinCode) {
    return NextResponse.json(
      { message: "가입 코드가 일치하지 않습니다" },
      { status: 400 }
    );
  }

  // 아이디 중복 확인
  // userId 필드를 사용해 사용자를 찾습니다
  const userSnapshot = await adminDb
    .collection("users")
    .where("userId", "==", userId)
    .get();

  if (!userSnapshot.empty) {
    return NextResponse.json(
      { message: "이미 존재하는 아이디입니다" },
      { status: 400 }
    );
  }

  const hashedPassword = await hash(password, 10);

  await adminDb.collection("users").doc().set({
    userId,
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ message: "가입이 완료되었습니다" });
}
