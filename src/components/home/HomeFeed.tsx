"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, MessageCircle } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import IconButton from "@/components/ui/IconButton";
import LikeButton from "@/components/ui/LikeButton";
import QuestionCard from "@/components/ui/QuestionCard";
import HomeAnswerComposer from "@/components/home/HomeAnswerComposer";
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
    <div className="space-y-7">
      <section id="answer" className="scroll-mt-24">
        <QuestionCard
          eyebrow="TODAY'S QUESTION"
          question={TODAY_QUESTION}
        />
        <div className="mt-3">
          <HomeAnswerComposer />
        </div>
      </section>

      <section aria-labelledby="feed-heading">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase text-clay">Today</p>
            <h1 id="feed-heading" className="mt-0.5 text-xl font-bold text-ink">
              오늘의 생각
            </h1>
          </div>
          <p className="text-[10px] text-ink-soft">최신순</p>
        </div>

        <div className="space-y-2.5">
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
                  className="block px-4 pb-2 pt-4"
                >
                  <header className="mb-3 flex items-center gap-2.5">
                    <Avatar label={answer.gender} size="sm" />
                    <div className="min-w-0">
                      <p className="flex items-baseline gap-1.5 text-xs font-semibold text-ink">
                        <span>{answer.gender}</span>
                        <span className="truncate text-[10px] font-normal text-ink-soft">
                          {answer.authorName}
                        </span>
                      </p>
                      <p className="mt-0.5 text-[10px] text-ink-soft/70">{answer.createdAt}</p>
                    </div>
                  </header>
                  <p className="whitespace-pre-wrap font-body text-[13px] leading-[1.7] text-ink">
                    {answer.content}
                  </p>
                </Link>

                <footer className="flex items-center gap-0.5 px-3 pb-2.5">
                  <LikeButton
                    liked={liked}
                    onClick={() => toggleSet(answer.id, setLikedIds)}
                  />
                  <Link
                    href={`/answers/${answer.id}#comments`}
                    aria-label="이 답변의 대화 보기"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs text-ink-soft transition hover:bg-white/[0.05] hover:text-ink"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                    <span>대화</span>
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