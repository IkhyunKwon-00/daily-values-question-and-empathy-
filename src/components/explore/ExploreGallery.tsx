"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { MOCK_EXPLORE_CARDS, type MockExploreCard } from "@/lib/mock-explore";
import { PUBLISHED_ANSWER_KEY, type PublishedMockAnswer } from "@/lib/mock-storage";

export default function ExploreGallery() {
  const [likedIds, setLikedIds] = useState(
    () => new Set(MOCK_EXPLORE_CARDS.filter((card) => card.liked).map((card) => card.id)),
  );
  const [publishedCard, setPublishedCard] = useState<MockExploreCard | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(PUBLISHED_ANSWER_KEY);
    if (!stored) return;
    const answer = JSON.parse(stored) as PublishedMockAnswer;
    setPublishedCard({
      id: "my-latest-answer",
      userId: "00000000-0000-4000-8000-000000000000",
      authorName: "나의 생각",
      gender: "기타",
      question: answer.question,
      answer: answer.answer,
      comments: 0,
      createdAt: "방금 전",
      liked: false,
    });
  }, []);

  const cards = publishedCard
    ? [publishedCard, ...MOCK_EXPLORE_CARDS]
    : MOCK_EXPLORE_CARDS;

  function toggleLike(id: string) {
    setLikedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="lg:-mx-8 xl:-mx-40">
      <header>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase text-clay">Discover</p>
            <h1 className="mt-0.5 text-2xl font-bold text-ink">탐색</h1>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-ink-soft">
              사람을 찾기보다, 오래 머물고 싶은 생각을 발견해 보세요.
            </p>
          </div>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card, index) => {
            const liked = likedIds.has(card.id);
            return (
              <article
                key={card.id}
                className={cn(
                  "relative overflow-hidden rounded-lg bg-paper-card shadow-soft ring-1 ring-white/[0.035] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1D1D1B] hover:shadow-card",
                  index % 5 === 0 && "bg-[#1D1C18]",
                )}
              >
                <Link href={`/feed/${card.id}`} className="block p-3.5">
                  <header className="flex items-center gap-2">
                    <Avatar label={card.authorName} size="sm" />
                    <span className="min-w-0 truncate text-[10px] text-ink-soft">
                      <strong className="font-semibold text-ink">{card.gender}</strong>
                      <span className="ml-1">{card.authorName}</span>
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[9px] text-ink-soft/45">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </header>
                  <h2 className="mt-3.5 break-words font-voice text-[15px] font-bold leading-[1.45] text-ink">
                    {card.question}
                  </h2>
                  <span className="mt-3 block h-px w-6 bg-clay/70" aria-hidden />
                  <p className="mt-3 break-words font-body text-xs leading-[1.65] text-ink-soft">
                    {card.answer}
                  </p>
                </Link>
                <footer className="flex items-center px-2.5 pb-2.5">
                  <button
                    type="button"
                    onClick={() => toggleLike(card.id)}
                    aria-label={liked ? "공감 취소" : "공감하기"}
                    aria-pressed={liked}
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 rounded-lg px-1.5 text-[10px] font-medium transition active:scale-95",
                      liked ? "text-clay" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    <Heart className={cn("h-3.5 w-3.5", liked && "animate-pop fill-current")} />
                    {liked ? "공감함" : "공감"}
                  </button>
                  <span className="ml-auto text-[9px] text-ink-soft/70">{card.createdAt}</span>
                </footer>
              </article>
            );
          })}
        </div>
    </div>
  );
}