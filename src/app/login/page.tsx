"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GENDER_LABEL, type Gender } from "@/lib/types";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setPending(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace("/");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { gender } },
        });
        if (error) throw error;
        if (data.session) {
          router.replace("/");
          router.refresh();
        } else {
          setNotice("확인 메일을 보냈어요. 메일의 링크를 눌러 가입을 완료해 주세요.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "문제가 발생했어요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="font-voice text-3xl leading-snug text-ink">
          오늘의 가치관
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          외모가 아닌 생각과 가치관으로 먼저.
          <br />
          매일 하나의 질문에 진솔한 답을 남겨보세요.
        </p>
      </header>

      <form onSubmit={onSubmit} className="card space-y-4 p-6">
        <div className="flex rounded-full border border-line p-1 text-sm">
          {(["login", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
                setNotice(null);
              }}
              className={`flex-1 rounded-full py-1.5 transition-colors ${
                mode === m ? "bg-ink text-paper-card" : "text-ink-soft"
              }`}
            >
              {m === "login" ? "로그인" : "가입"}
            </button>
          ))}
        </div>

        <label className="block space-y-1.5">
          <span className="meta">이메일</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            placeholder="you@example.com"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="meta">비밀번호</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            placeholder="6자 이상"
          />
        </label>

        {mode === "signup" && (
          <div className="space-y-1.5">
            <span className="meta">성별 (피드에 표시됩니다)</span>
            <div className="flex gap-2">
              {(Object.keys(GENDER_LABEL) as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex-1 rounded-full border py-2 text-sm transition-colors ${
                    gender === g
                      ? "border-clay bg-clay text-paper-card"
                      : "border-line text-ink-soft"
                  }`}
                >
                  {GENDER_LABEL[g]}
                </button>
              ))}
            </div>
            <p className="text-xs text-ink-soft/80">
              사진·나이·지역 등 나머지 정보는 매칭 전까지 공개되지 않아요.
            </p>
          </div>
        )}

        {error && <p className="text-sm text-clay">{error}</p>}
        {notice && <p className="text-sm text-sage">{notice}</p>}

        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "잠시만요…" : mode === "login" ? "로그인" : "가입하기"}
        </button>
      </form>
    </div>
  );
}
