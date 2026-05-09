"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import client from "@/lib/postgres";
import {
  makeUnlockToken,
  unlockCookieName,
  UNLOCK_COOKIE_MAX_AGE,
} from "./gate";

const isDev = process.env.APP_ENVIRONMENT === "dev";

export async function verifyOriginalsPassword(
  postId: string,
  password: string,
): Promise<{ ok: boolean }> {
  const res = await client.query(
    `SELECT password FROM originals WHERE post_id = $1 AND ${isDev ? "TRUE" : "is_show = TRUE"} LIMIT 1`,
    [postId],
  );
  const stored: string | null = res.rows[0]?.password ?? null;
  if (!stored) return { ok: false };
  if (password !== stored) return { ok: false };

  const token = makeUnlockToken(postId, stored);
  const cookieStore = await cookies();
  cookieStore.set(unlockCookieName(postId), token, {
    httpOnly: true,
    secure: !isDev,
    sameSite: "lax",
    maxAge: UNLOCK_COOKIE_MAX_AGE,
    path: `/originals/${postId}`,
  });
  revalidatePath(`/originals/${postId}`);
  return { ok: true };
}
