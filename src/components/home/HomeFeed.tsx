"use client";

import Link from "next/link";
import { useState } from "react";
import EmptyState from "@/components/ui/EmptyState";
import LikeButton from "@/components/ui/LikeButton";
import HomeAnswerComposer from "@/components/home/HomeAnswerComposer";
import { MOCK_HOME_ANSWERS, TODAY_QUESTION } from "@/lib/mock-home";

export default function HomeFeed() {
  const [likedIds, setLikedIds] = useState(
    () => new Set(MOCK_HOME_ANSWERS.filter((answer) => answer.liked).map((answer) => answer.id)),
  );

  function toggleLike(id: string) {
    setLikedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <section id="answer" className="scroll-mt-24 border-b border-line/70 pb-12 pt-4 sm:pb-16 sm:pt-8">
        <p className="text-xs font-semibold uppercase text-ink-soft">오늘의 질문</p>
        <h1 className="mt-5 max-w-[18ch] break-words font-voice text-[clamp(2.25rem,8vw,4rem)] font-bold leading-[1.25] text-ink">
          {TODAY_QUESTION}
        </h1>
        <div className="mt-8">
          <HomeAnswerComposer />
        </div>
      </section>

      <section aria-labelledby="feed-heading" className="pt-10 sm:pt-14">
        <div className="mb-2">
          <p className="text-xs font-semibold uppercase text-ink-soft">오늘 도착한 생각</p>
          <h2 id="feed-heading" className="mt-2 text-2xl font-bold text-ink">
            사람들은 이렇게 답했어요
          </h2>
        </div>

        {MOCK_HOME_ANSWERS.length === 0 ? (
          <EmptyState
            className="mt-8 border-y border-line/60"
            title="아직 도착한 답변이 없어요"
            description="오늘의 첫 번째 생각을 남겨보세요."
          />
        ) : (
          <div role="feed" aria-busy="false">
            {MOCK_HOME_ANSWERS.map((answer, index) => {
            const liked = likedIds.has(answer.id);

            return (
              <article
                key={answer.id}
                aria-labelledby={`${answer.id}-author`}
                aria-posinset={index + 1}
                aria-setsize={MOCK_HOME_ANSWERS.length}
                className="border-b border-line/60 py-10 first:pt-8 sm:py-14"
              >
                <Link
                  href={`/answers/${answer.id}`}
                  className="group block"
                >
                  <header className="flex items-center gap-2 text-xs text-ink-soft">
                    <p id={`${answer.id}-author`} className="font-semibold text-ink-soft">
                      {answer.gender}
                    </p>
                    <span aria-hidden>·</span>
                    <time>{answer.createdAt}</time>
                  </header>
                  <p className="mt-5 break-words whitespace-pre-wrap font-body text-xl leading-[1.8] text-ink transition-colors group-hover:text-white sm:text-[1.4rem]">
                    {answer.content}
                  </p>
                </Link>

                <footer className="mt-6 flex items-center">
                  <LikeButton liked={liked} onClick={() => toggleLike(answer.id)} />
                  <span className="sr-only">좋아요 수는 표시되지 않습니다.</span>
                </footer>
              </article>
            );
            })}
          </div>
        )}
      </section>
    </div>
  );
}