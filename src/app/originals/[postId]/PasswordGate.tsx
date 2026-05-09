"use client";

import { useState, useTransition } from "react";
import { verifyOriginalsPassword } from "./actions";

export default function PasswordGate({ postId }: { postId: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await verifyOriginalsPassword(postId, password);
      if (!res.ok) {
        setError("비밀번호가 일치하지 않습니다.");
        setPassword("");
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <p className="text-md">🔒 보호된 게시글입니다.</p>
      <p className="text-foreground/70">
        본문을 보려면 비밀번호를 입력하세요.
      </p>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-stretch gap-2 w-full max-w-xs"
      >
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          disabled={isPending}
          autoFocus
          className="border border-hr bg-background px-3 py-2 rounded text-base focus:outline-none focus:border-foreground disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending || !password}
          className="bg-foreground text-background px-3 py-2 rounded text-base disabled:opacity-50"
        >
          {isPending ? "확인 중..." : "확인"}
        </button>
        {error && (
          <p className="text-red-600 text-sm mt-1" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
