"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import {
  PUBLISHED_ANSWER_KEY,
  WRITE_DRAFT_KEY,
  type PublishedMockAnswer,
} from "@/lib/mock-storage";

const QUESTION = "행복은 결국 무엇에서 온다고 생각하나요?";
const CATEGORIES = ["사랑", "관계", "일", "돈", "행복", "자아", "취향", "삶"];
const MAX_LENGTH = 500;

type Phase = "write" | "preview" | "published";

export default function WriteAnswerPage() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("행복");
  const [phase, setPhase] = useState<Phase>("write");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(WRITE_DRAFT_KEY);
    if (stored) {
      const draft = JSON.parse(stored) as { answer?: string; category?: string };
      setAnswer(draft.answer ?? "");
      setCategory(draft.category ?? "행복");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || phase === "published") return;
    window.localStorage.setItem(WRITE_DRAFT_KEY, JSON.stringify({ answer, category }));
  }, [answer, category, hydrated, phase]);

  const count = Array.from(answer).length;
  const canContinue = answer.trim().length > 0;

  function updateAnswer(value: string) {
    setAnswer(Array.from(value).slice(0, MAX_LENGTH).join(""));
  }

  function publish() {
    if (!canContinue) return;
    const published: PublishedMockAnswer = { question: QUESTION, answer, category };
    window.localStorage.removeItem(WRITE_DRAFT_KEY);
    window.localStorage.setItem(PUBLISHED_ANSWER_KEY, JSON.stringify(published));
    setPhase("published");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (phase === "published") {
    return (
      <div className="mx-auto max-w-xl py-4 animate-fade-up">
        <div className="flex items-center gap-2 text-sm font-semibold text-clay">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-clay text-paper">
            <Check className="h-4 w-4" />
          </span>
          답변이 올라갔어요
        </div>
        <h1 className="mt-5 text-3xl font-bold leading-tight text-ink">
          오늘의 생각에<br />당신의 문장이 더해졌어요.
        </h1>

        <article className="mt-8 rounded-lg bg-paper-card p-5 shadow-card sm:p-6">
          <header className="flex items-center gap-3">
            <Avatar label="나" />
            <div>
              <p className="text-sm font-semibold text-ink">나의 답변</p>
              <p className="text-xs text-ink-soft">방금 전 · {category}</p>
            </div>
          </header>
          <p className="mt-5 whitespace-pre-wrap text-[15px] leading-[1.85] text-ink">
            {answer}
          </p>
        </article>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Link href="/feed/my-latest-answer" className="btn-primary">게시된 답변 보기</Link>
          <Link href="/feed" className="btn-ghost">탐색 피드 보기</Link>
        </div>
      </div>
    );
  }

  if (phase === "preview") {
    return (
      <div className="mx-auto max-w-xl py-4 animate-fade-up">
        <button
          type="button"
          onClick={() => setPhase("write")}
          className="inline-flex items-center gap-2 text-sm text-ink-soft transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          수정하기
        </button>
        <p className="mt-8 text-xs font-semibold uppercase text-clay">Preview</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">이렇게 보이게 돼요</h1>

        <article className="mt-6 rounded-lg bg-paper-card p-5 shadow-card sm:p-6">
          <Tag>{category}</Tag>
          <p className="mt-5 text-lg font-bold leading-relaxed text-ink">{QUESTION}</p>
          <div className="mt-6 flex items-center gap-3">
            <Avatar label="나" />
            <span className="text-sm text-ink-soft">나의 답변</span>
          </div>
          <p className="mt-5 whitespace-pre-wrap text-[15px] leading-[1.85] text-ink">
            {answer}
          </p>
        </article>

        <div className="mt-6 flex gap-2">
          <Button className="flex-1" variant="secondary" onClick={() => setPhase("write")}>
            다시 쓰기
          </Button>
          <Button className="flex-1" onClick={publish}>답변 올리기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <header className="flex items-center gap-3 py-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="grid h-10 w-10 place-items-center rounded-lg text-ink-soft transition hover:bg-white/[0.05] hover:text-ink"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-bold text-ink">질문에 답하기</h1>
      </header>

      <section className="pb-7 pt-8">
        <p className="text-xs font-semibold uppercase text-clay">Today&apos;s Question</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-bold leading-[1.4] text-ink sm:text-4xl">
          {QUESTION}
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-ink-soft">
          정답은 없어요.<br />조금 솔직해도 괜찮아요.
        </p>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (canContinue) setPhase("preview");
        }}
      >
        <label htmlFor="answer" className="sr-only">나의 답변</label>
        <textarea
          id="answer"
          value={answer}
          onChange={(event) => updateAnswer(event.target.value)}
          placeholder={"나는 행복이 결국\n내가 누구와 시간을 보내느냐에서\n온다고 생각해요..."}
          className="min-h-[42vh] w-full resize-none rounded-lg bg-paper-card p-5 text-base leading-[1.9] text-ink shadow-soft outline-none transition placeholder:text-ink-soft/45 focus:ring-1 focus:ring-clay/60 sm:min-h-[22rem] sm:p-6 sm:text-[17px]"
        />

        <div className="mt-3 flex items-center justify-between text-xs text-ink-soft">
          <span>당신의 언어로 천천히 적어보세요</span>
          <span className={cn(count >= 450 && "text-clay")}>{count} / {MAX_LENGTH}</span>
        </div>

        <fieldset className="mt-8">
          <legend className="text-sm font-semibold text-ink">이 생각의 카테고리</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  category === item
                    ? "bg-clay text-paper"
                    : "bg-paper-card text-ink-soft hover:text-ink",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <Button type="submit" size="lg" className="mt-9 w-full" disabled={!canContinue}>
          <PenLine className="h-4 w-4" />
          미리보기
        </Button>
      </form>
    </div>
  );
}