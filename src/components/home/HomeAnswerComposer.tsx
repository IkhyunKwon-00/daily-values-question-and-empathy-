"use client";

import { useEffect, useState } from "react";
import { Check, PenLine } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { TODAY_QUESTION } from "@/lib/mock-home";
import {
  PUBLISHED_ANSWER_KEY,
  WRITE_DRAFT_KEY,
  type PublishedMockAnswer,
} from "@/lib/mock-storage";
import { ANSWER_MAX_LENGTH } from "@/lib/types";

type Phase = "closed" | "write" | "preview" | "published";

export default function HomeAnswerComposer() {
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<Phase>("closed");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const draft = window.localStorage.getItem(WRITE_DRAFT_KEY);
    const published = window.localStorage.getItem(PUBLISHED_ANSWER_KEY);

    if (published) {
      const saved = JSON.parse(published) as PublishedMockAnswer;
      if (saved.question === TODAY_QUESTION) {
        setAnswer(saved.answer);
        setPhase("published");
      }
    } else if (draft) {
      const saved = JSON.parse(draft) as { answer?: string };
      setAnswer(saved.answer ?? "");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || phase === "published") return;
    window.localStorage.setItem(WRITE_DRAFT_KEY, JSON.stringify({ answer }));
  }, [answer, hydrated, phase]);

  const count = Array.from(answer).length;
  const canContinue = answer.trim().length > 0;

  function updateAnswer(value: string) {
    setAnswer(Array.from(value).slice(0, ANSWER_MAX_LENGTH).join(""));
  }

  function publish() {
    if (!canContinue) return;
    window.localStorage.setItem(
      PUBLISHED_ANSWER_KEY,
      JSON.stringify({ question: TODAY_QUESTION, answer } satisfies PublishedMockAnswer),
    );
    window.localStorage.removeItem(WRITE_DRAFT_KEY);
    setPhase("published");
  }

  if (phase === "closed") {
    return (
      <Button className="!shadow-none" size="lg" onClick={() => setPhase("write")}>
        <PenLine className="h-4 w-4" />
        나도 답해보기
      </Button>
    );
  }

  if (phase === "published") {
    return (
      <article className="rounded-lg bg-paper-card p-5 shadow-soft animate-fade-up sm:p-6">
        <header className="flex items-center gap-3">
          <Avatar label="나" />
          <div>
            <p className="text-sm font-semibold text-ink">오늘의 내 답변</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-clay">
              <Check className="h-3.5 w-3.5" />피드에 올라갔어요
            </p>
          </div>
        </header>
        <p className="mt-5 whitespace-pre-wrap font-body text-[15px] leading-[1.9] text-ink">
          {answer}
        </p>
        <button
          type="button"
          className="mt-5 text-xs text-ink-soft transition hover:text-ink"
          onClick={() => setPhase("write")}
        >
          답변 수정하기
        </button>
      </article>
    );
  }

  if (phase === "preview") {
    return (
      <div className="rounded-lg bg-paper-card p-5 shadow-soft animate-fade-up sm:p-6">
        <p className="text-xs font-semibold uppercase text-ink-soft">Preview</p>
        <p className="mt-4 font-voice text-xl font-bold leading-[1.55] text-ink">
          {TODAY_QUESTION}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <Avatar label="나" size="sm" />
          <span className="text-xs text-ink-soft">나의 답변</span>
        </div>
        <p className="mt-4 whitespace-pre-wrap font-body text-[15px] leading-[1.85] text-ink">
          {answer}
        </p>
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
    <form
      className="rounded-lg bg-paper-card p-5 shadow-soft animate-fade-up sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (canContinue) setPhase("preview");
      }}
    >
      <div className="flex items-center justify-between">
        <label htmlFor="home-answer" className="text-sm font-semibold text-ink">
          나의 오늘 생각
        </label>
        <span className={cn("text-xs text-ink-soft", count >= 450 && "text-clay")}>
          {count} / {ANSWER_MAX_LENGTH}
        </span>
      </div>
      <textarea
        id="home-answer"
        autoFocus
        value={answer}
        onChange={(event) => updateAnswer(event.target.value)}
        placeholder="정답을 찾기보다, 지금 떠오르는 생각을 천천히 적어보세요."
        className="mt-4 min-h-52 w-full resize-none bg-transparent font-body text-base leading-[1.9] text-ink outline-none placeholder:text-ink-soft/45 sm:min-h-64 sm:text-[17px]"
      />
      <div className="mt-4 flex justify-end gap-2 border-t border-line/60 pt-4">
        <Button type="button" variant="ghost" onClick={() => setPhase("closed")}>
          닫기
        </Button>
        <Button type="submit" disabled={!canContinue}>미리보기</Button>
      </div>
    </form>
  );
}