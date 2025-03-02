import JoinForm from "@/components/admin/JoinForm";
import { adminDb } from "@/app/lib/firebaseAdmin";
import { redirect } from "next/navigation";

async function checkState() {
  const doc = await adminDb.collection("pageState").doc("admin").get();
  if (!doc.exists) {
    return false;
  }

  const data = doc.data();
  return data?.isJoinAvailable;
}

export default async function Join() {
  const isJoinAvailable = await checkState();

  if (!isJoinAvailable) {
    redirect("/");
  }

  return (
    <>
      <JoinForm />
    </>
  );
}
