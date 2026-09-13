"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Bookmark, MessageCircle } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import LikeButton from "@/components/ui/LikeButton";
import Tag from "@/components/ui/Tag";
import { TODAY_QUESTION, type MockHomeAnswer } from "@/lib/mock-home";

export default function AnswerDetail({
  answer,
  question = TODAY_QUESTION,
  backHref = "/",
  backLabel = "오늘의 생각으로",
}: {
  answer: MockHomeAnswer;
  question?: string;
  backHref?: string;
  backLabel?: string;
}) {
  const [liked, setLiked] = useState(answer.liked);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  return (
    <article>
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm text-ink-soft transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <Tag tone="accent">오늘의 질문</Tag>
      <h1 className="mt-4 text-xl font-bold leading-[1.5] text-ink sm:text-2xl">
        {question}
      </h1>

      <section className="mt-8 rounded-lg bg-paper-card p-5 shadow-card sm:p-7">
        <header className="flex items-center gap-3">
          <Avatar label={answer.gender} size="lg" />
          <div>
            <p className="font-semibold text-ink">{answer.gender}</p>
            <p className="mt-0.5 text-xs text-ink-soft">{answer.createdAt}</p>
          </div>
        </header>
        <p className="mt-7 whitespace-pre-wrap text-base leading-[1.9] text-ink sm:text-[17px]">
          {answer.content}
        </p>
        <footer className="mt-7 flex items-center gap-1">
          <LikeButton liked={liked} onClick={() => setLiked((value) => !value)} />
          <span className="inline-flex h-10 items-center gap-1.5 px-2.5 text-sm text-ink-soft">
            <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
            {answer.comments + comments.length}
          </span>
          <IconButton
            className="ml-auto"
            label={saved ? "저장 취소" : "답변 저장"}
            active={saved}
            icon={<Bookmark className={saved ? "fill-current" : undefined} />}
            onClick={() => setSaved((value) => !value)}
          />
        </footer>
      </section>

      <section id="comments" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-bold text-ink">댓글</h2>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!comment.trim()) return;
            setComments((current) => [...current, comment.trim()]);
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
            {comments.map((body, index) => (
              <li key={`${body}-${index}`} className="rounded-lg bg-paper-card p-4 text-sm leading-relaxed text-ink">
                {body}
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}