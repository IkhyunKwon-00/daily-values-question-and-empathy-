"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GENDER_LABEL, type Gender } from "@/lib/types";
import BrandMark from "@/components/layout/BrandMark";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [pending, setPending] = useState(false);
  const [demoPending, setDemoPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function startDemo() {
    setError(null);
    setNotice(null);
    setDemoPending(true);

    const { error } = await supabase.auth.signInAnonymously({
      options: { data: { gender: "other" } },
    });

    if (error) {
      setError(
        error.message.toLowerCase().includes("anonymous")
          ? "지금은 체험 로그인을 사용할 수 없어요. 잠시 후 다시 시도해 주세요."
          : error.message
      );
      setDemoPending(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

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
        <h1><BrandMark linked={false} /></h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          사람을 만나기 전에, 그 사람의 생각을 먼저.
          <br />
          매일 하나의 질문에 진솔한 답을 남겨보세요.
        </p>
      </header>

      <form onSubmit={onSubmit} className="card space-y-4 p-6">
        <div className="flex rounded-lg border border-line p-1 text-sm">
          {(["login", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
                setNotice(null);
              }}
              className={`min-h-11 flex-1 rounded-md px-3 py-2 transition-colors ${
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
                  className={`min-h-11 flex-1 rounded-lg border px-2 py-2 text-sm transition-colors ${
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

        <button
          type="submit"
          disabled={pending || demoPending}
          className="btn-primary w-full"
        >
          {pending ? "잠시만요…" : mode === "login" ? "로그인" : "가입하기"}
        </button>

        <div className="flex items-center gap-3 py-1" aria-hidden>
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs text-ink-soft">또는</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <button
          type="button"
          disabled={pending || demoPending}
          onClick={startDemo}
          className="btn-ghost w-full"
        >
          {demoPending ? "체험 준비 중…" : "이메일 없이 체험하기"}
        </button>
      </form>
    </div>
  );
}
