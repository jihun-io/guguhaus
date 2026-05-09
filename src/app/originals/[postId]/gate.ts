import crypto from "node:crypto";

function getSecret(): string {
  const secret = process.env.ORIGINALS_GATE_SECRET;
  if (!secret) {
    throw new Error("ORIGINALS_GATE_SECRET is not set");
  }
  return secret;
}

export function makeUnlockToken(
  postId: string,
  storedPassword: string,
): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`${postId}:${storedPassword}`)
    .digest("hex");
}

export function isUnlockTokenValid(
  postId: string,
  storedPassword: string,
  token: string,
): boolean {
  let expected: string;
  try {
    expected = makeUnlockToken(postId, storedPassword);
  } catch {
    return false;
  }
  if (token.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

export const UNLOCK_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 * 6;

export function unlockCookieName(postId: string): string {
  return `originals_unlock_${postId}`;
}
