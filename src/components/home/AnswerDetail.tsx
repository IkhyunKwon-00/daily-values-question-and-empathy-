"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Ban,
  Flag,
  Heart,
  MoreHorizontal,
} from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import IconButton from "@/components/ui/IconButton";
import { TODAY_QUESTION, type MockHomeAnswer } from "@/lib/mock-home";
import type { MockComment, MockThought } from "@/lib/mock-people";

export default function AnswerDetail({
  answer,
  question = TODAY_QUESTION,
  backHref = "/",
  backLabel = "오늘의 생각으로",
  authorId,
  otherThoughts = [],
  mutualInterest = false,
  profileHref,
}: {
  answer: MockHomeAnswer;
  question?: string;
  backHref?: string;
  backLabel?: string;
  authorId: string;
  otherThoughts?: MockThought[];
  initialComments?: MockComment[];
  mutualInterest?: boolean;
  profileHref?: string;
}) {
  const [liked, setLiked] = useState(answer.liked);
  const [matched, setMatched] = useState(answer.liked && mutualInterest);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  function toggleLike() {
    setLiked((current) => {
      const next = !current;
      setMatched(next && mutualInterest);
      return next;
    });
  }

  if (blocked) {
    return (
      <div className="py-16 text-center">
        <Ban className="mx-auto h-6 w-6 text-ink-soft" />
        <h1 className="mt-5 text-xl font-bold text-ink">차단한 사용자의 생각이에요</h1>
        <p className="mt-2 text-sm text-ink-soft">이 사용자의 콘텐츠는 더 이상 표시되지 않아요.</p>
        <Link href={backHref} className="btn-ghost mt-6">{backLabel}</Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-[42rem]">
      <header className="sticky top-0 z-20 -mx-5 mb-10 flex h-14 items-center bg-paper/90 px-4 backdrop-blur-xl sm:-mx-8 sm:px-7">
        <Link href={backHref} aria-label={backLabel} className="grid h-11 w-11 place-items-center rounded-lg text-ink-soft transition hover:bg-white/[0.05] hover:text-ink">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="ml-2 text-sm font-semibold text-ink">답변</span>
        <IconButton className="ml-auto" label="더보기" icon={<MoreHorizontal />} onClick={() => setMenuOpen(true)} />
      </header>

      <p className="text-xs font-semibold uppercase text-ink-soft">질문</p>
      <h1 className="mt-4 max-w-[24ch] break-words font-voice text-[clamp(1.75rem,6vw,2.75rem)] font-bold leading-[1.4] text-ink">
        {question}
      </h1>

      <section className="mt-14">
        <Link
          href={profileHref ?? `/people/${authorId}`}
          className="inline-flex items-center gap-2 text-sm text-ink-soft transition hover:text-ink"
        >
          <span className="font-semibold text-ink">{answer.gender}</span>
          <span aria-hidden>·</span>
          <span>{answer.createdAt}</span>
        </Link>
        <p className="mt-8 break-words whitespace-pre-wrap font-body text-[1.35rem] leading-[1.9] text-ink sm:text-[1.55rem]">
          {answer.content}
        </p>
        <footer className="mt-10 border-t border-line/60 pt-6">
          <button type="button" onClick={toggleLike} aria-pressed={liked} className={`inline-flex h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition active:scale-95 ${liked ? "bg-clay text-paper" : "border border-line text-ink-soft hover:border-ink-soft hover:text-ink"}`}>
            <Heart className={`h-5 w-5 ${liked ? "animate-pop fill-current" : ""}`} strokeWidth={1.8} />
            {liked ? "마음에 들었어요" : "마음에 들어요"}
          </button>
        </footer>
      </section>

      {otherThoughts.length > 0 && (
        <section className="mt-16 border-t border-line/60 pt-12">
          <p className="text-xs font-semibold uppercase text-ink-soft">Thought archive</p>
          <h2 className="mt-3 text-2xl font-bold text-ink">이 사람의 다른 생각</h2>
          <div className="mt-7 divide-y divide-line/60 border-y border-line/60">
            {otherThoughts.slice(0, 4).map((thought) => (
              <article key={thought.id} className="py-7">
                <Link href={thought.href} className="block">
                  <h3 className="break-words font-voice text-xl font-bold leading-[1.55] text-ink transition-colors hover:text-clay">
                    {thought.question}
                  </h3>
                  <p className="mt-3 line-clamp-2 break-words font-body text-[15px] leading-[1.8] text-ink-soft">
                    {thought.answer}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {matched && (
        <section className="mt-12 border-y border-clay/40 py-8 animate-fade-up">
          <p className="font-voice text-2xl font-bold text-ink">서로의 생각이 통했어요.</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            얼굴보다 먼저 만난 문장에서 대화를 이어가 보세요.
          </p>
          <Link href={`/messages/${authorId}`} className="btn-primary mt-6">대화 시작하기</Link>
        </section>
      )}

      <section className="mt-16 border-t border-line/60 py-12 text-center">
        <p className="font-voice text-2xl font-bold text-ink">
          이 사람의 생각이 더 궁금하다면
        </p>
        <Link href={profileHref ?? `/people/${authorId}`} className="btn-primary mt-6">
          프로필 보기
        </Link>
      </section>

      {notice && <p role="status" className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-paper shadow-card">{notice}</p>}

      <BottomSheet open={menuOpen} onClose={() => setMenuOpen(false)} title="답변 메뉴">
        <div className="grid gap-2">
          <button type="button" className="flex h-12 items-center gap-3 rounded-lg px-3 text-sm text-ink-soft hover:bg-white/[0.05] hover:text-ink" onClick={() => { setNotice("신고가 접수됐어요."); setMenuOpen(false); }}>
            <Flag className="h-5 w-5" />신고하기
          </button>
          <button type="button" className="flex h-12 items-center gap-3 rounded-lg px-3 text-sm text-rose hover:bg-rose/10" onClick={() => { setBlocked(true); setMenuOpen(false); }}>
            <Ban className="h-5 w-5" />차단하기
          </button>
        </div>
      </BottomSheet>
    </article>
  );
}