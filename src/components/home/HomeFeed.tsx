"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, MessageCircle } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import IconButton from "@/components/ui/IconButton";
import LikeButton from "@/components/ui/LikeButton";
import QuestionCard from "@/components/ui/QuestionCard";
import { MOCK_HOME_ANSWERS, TODAY_QUESTION } from "@/lib/mock-home";

export default function HomeFeed() {
  const [likedIds, setLikedIds] = useState(
    () => new Set(MOCK_HOME_ANSWERS.filter((answer) => answer.liked).map((answer) => answer.id)),
  );
  const [savedIds, setSavedIds] = useState(new Set<string>());

  function toggleSet(
    id: string,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) {
    setter((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-10">
      <section id="answer" className="scroll-mt-24">
        <QuestionCard
          eyebrow="TODAY'S QUESTION"
          category="삶의 방식"
          question={TODAY_QUESTION}
          meta={
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/write" className="btn-primary h-12 px-6 text-[15px]">
                오늘의 질문에 답하기
              </Link>
              <span className="text-ink-soft">오늘 이미 답을 남겨 피드가 열렸어요</span>
            </div>
          }
        />
      </section>

      <section aria-labelledby="feed-heading">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-clay">Today</p>
            <h1 id="feed-heading" className="mt-1 text-2xl font-bold text-ink">
              오늘의 생각
            </h1>
          </div>
          <p className="text-xs text-ink-soft">최신순</p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {MOCK_HOME_ANSWERS.map((answer) => {
            const liked = likedIds.has(answer.id);
            const saved = savedIds.has(answer.id);

            return (
              <article
                key={answer.id}
                className="overflow-hidden rounded-lg bg-paper-card shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-card"
              >
                <Link
                  href={`/answers/${answer.id}`}
                  className="block px-5 pb-3 pt-5 sm:px-6 sm:pt-6"
                >
                  <header className="mb-5 flex items-center gap-3">
                    <Avatar label={answer.gender} />
                    <div>
                      <p className="text-sm font-semibold text-ink">{answer.gender}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">{answer.createdAt}</p>
                    </div>
                  </header>
                  <p className="whitespace-pre-wrap text-[15px] leading-[1.85] text-ink sm:text-base">
                    {answer.content}
                  </p>
                </Link>

                <footer className="flex items-center gap-1 px-4 pb-4 sm:px-5">
                  <LikeButton
                    liked={liked}
                    onClick={() => toggleSet(answer.id, setLikedIds)}
                  />
                  <Link
                    href={`/answers/${answer.id}#comments`}
                    aria-label={`댓글 ${answer.comments}개 보기`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm text-ink-soft transition hover:bg-white/[0.05] hover:text-ink"
                  >
                    <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
                    <span>{answer.comments}</span>
                  </Link>
                  <IconButton
                    className="ml-auto"
                    label={saved ? "저장 취소" : "답변 저장"}
                    active={saved}
                    icon={<Bookmark className={saved ? "fill-current" : undefined} />}
                    onClick={() => toggleSet(answer.id, setSavedIds)}
                  />
                </footer>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}