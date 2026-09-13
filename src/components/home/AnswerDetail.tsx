"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Ban,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import LikeButton from "@/components/ui/LikeButton";
import { TODAY_QUESTION, type MockHomeAnswer } from "@/lib/mock-home";
import type { MockComment, MockThought } from "@/lib/mock-people";

export default function AnswerDetail({
  answer,
  question = TODAY_QUESTION,
  backHref = "/",
  backLabel = "오늘의 생각으로",
  authorId,
  otherThoughts = [],
  initialComments = [],
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
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [relatedLikedIds, setRelatedLikedIds] = useState(
    () => new Set(otherThoughts.filter((thought) => thought.liked).map((thought) => thought.id)),
  );

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
        <Link href={backHref} aria-label={backLabel} className="grid h-10 w-10 place-items-center rounded-lg text-ink-soft transition hover:bg-white/[0.05] hover:text-ink">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="ml-2 text-sm font-semibold text-ink">답변</span>
        <IconButton className="ml-auto" label="더보기" icon={<MoreHorizontal />} onClick={() => setMenuOpen(true)} />
      </header>

      <p className="text-xs font-semibold uppercase text-clay">Question</p>
      <h1 className="mt-4 max-w-[24ch] font-voice text-[clamp(1.75rem,6vw,2.65rem)] font-bold leading-[1.45] text-ink">
        {question}
      </h1>

      <section className="mt-12">
        <Link href={profileHref ?? `/people/${authorId}`} className="inline-flex items-center gap-3 rounded-lg pr-3 transition hover:bg-white/[0.04]">
          <Avatar label={answer.gender} />
          <div>
            <p className="font-semibold text-ink">{answer.gender}</p>
            <p className="mt-0.5 text-xs text-ink-soft">{answer.createdAt}</p>
          </div>
        </Link>
        <p className="mt-8 whitespace-pre-wrap font-body text-[17px] leading-[2] text-ink sm:text-lg">
          {answer.content}
        </p>
        <footer className="mt-9 flex items-center gap-2 border-y border-line/60 py-4">
          <button type="button" onClick={toggleLike} aria-pressed={liked} className={`inline-flex h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition active:scale-95 ${liked ? "bg-clay/10 text-clay" : "text-ink-soft hover:bg-white/[0.05] hover:text-ink"}`}>
            <Heart className={`h-5 w-5 ${liked ? "animate-pop fill-current" : ""}`} strokeWidth={1.8} />
            {liked ? "관심을 보냈어요" : "이 생각에 관심 있어요"}
          </button>
          <a href="#comments" className="ml-auto inline-flex h-11 items-center gap-2 rounded-lg px-3 text-sm text-ink-soft transition hover:bg-white/[0.05] hover:text-ink">
            <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
            대화하기
          </a>
        </footer>
      </section>

      {matched && (
        <section className="mt-8 rounded-lg bg-paper-card p-6 animate-fade-up">
          <p className="text-sm font-semibold text-clay">서로의 생각이 통했어요.</p>
          <h2 className="mt-3 text-xl font-bold text-ink">서로의 생각에 관심이 생겼어요.</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">얼굴보다 먼저 만난 문장에서 대화를 이어가 보세요.</p>
          <Link href={`/messages/${authorId}`} className="btn-primary mt-5">대화 시작하기</Link>
        </section>
      )}

      <section id="comments" className="mt-10 scroll-mt-24">
        <p className="text-xs font-semibold uppercase text-clay">Conversation</p>
        <h2 className="mt-2 text-xl font-bold text-ink">이 생각에 건넨 말</h2>
        <form
          className="mt-5 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!comment.trim()) return;
            setComments((current) => [
              ...current,
              { id: `mine-${Date.now()}`, gender: "기타", body: comment.trim(), createdAt: "방금 전" },
            ]);
            setComment("");
          }}
        >
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="field min-w-0 flex-1"
            placeholder="생각을 존중하는 댓글을 남겨보세요"
            aria-label="댓글"
          />
          <Button type="submit" disabled={!comment.trim()}>등록</Button>
        </form>
        {comments.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-soft">
            아직 표시할 댓글이 없어요. 첫 생각을 건네보세요.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {comments.map((item) => (
              <li key={item.id} className="flex gap-3 py-3">
                <Avatar label={item.gender} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-ink-soft">
                    <span>{item.gender}</span><span>·</span><span>{item.createdAt}</span>
                  </div>
                  <p className="mt-2 text-sm leading-[1.8] text-ink">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {otherThoughts.length > 0 && (
        <section className="mt-14 border-t border-line/60 pt-10">
          <p className="text-xs font-semibold uppercase text-clay">More from this person</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">이 사람의 다른 생각</h2>
          <div className="mt-6 space-y-3">
            {otherThoughts.slice(0, 3).map((thought) => (
              <article key={thought.id} className="rounded-lg bg-paper-card p-5 transition hover:bg-[#1D1D1B]">
                <Link href={thought.href} className="block">
                  <p className="font-voice text-lg font-bold leading-[1.55] text-ink">{thought.question}</p>
                  <p className="mt-3 line-clamp-3 font-body text-sm leading-[1.8] text-ink-soft">{thought.answer}</p>
                </Link>
                <footer className="mt-4 flex items-center gap-2">
                  <Avatar label={thought.gender} size="sm" />
                  <span className="text-xs text-ink-soft">{thought.gender}</span>
                  <LikeButton
                    className="ml-auto"
                    liked={relatedLikedIds.has(thought.id)}
                    size="sm"
                    onClick={() => setRelatedLikedIds((current) => {
                      const next = new Set(current);
                      if (next.has(thought.id)) next.delete(thought.id);
                      else next.add(thought.id);
                      return next;
                    })}
                  />
                </footer>
              </article>
            ))}
          </div>
          <Link href={profileHref ?? `/people/${authorId}`} className="btn-ghost mt-5 w-full">이 사람의 생각 더 보기</Link>
        </section>
      )}

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