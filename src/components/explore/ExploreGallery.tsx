"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { Heart, Search, X } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import IconButton from "@/components/ui/IconButton";
import Tag from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import {
  EXPLORE_CATEGORIES,
  MOCK_EXPLORE_CARDS,
  type MockExploreCard,
} from "@/lib/mock-explore";
import { PUBLISHED_ANSWER_KEY, type PublishedMockAnswer } from "@/lib/mock-storage";

type Category = (typeof EXPLORE_CATEGORIES)[number];

export default function ExploreGallery() {
  const [selected, setSelected] = useState<Category>("전체");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [likedIds, setLikedIds] = useState(
    () => new Set(MOCK_EXPLORE_CARDS.filter((card) => card.liked).map((card) => card.id)),
  );
  const [publishedCard, setPublishedCard] = useState<MockExploreCard | null>(null);
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("ko"));

  useEffect(() => {
    const stored = window.localStorage.getItem(PUBLISHED_ANSWER_KEY);
    if (!stored) return;
    const answer = JSON.parse(stored) as PublishedMockAnswer;
    setPublishedCard({
      id: "my-latest-answer",
      gender: "기타",
      category: EXPLORE_CATEGORIES.includes(answer.category as Category)
        ? (answer.category as MockExploreCard["category"])
        : "삶",
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
  const filtered = cards.filter((card) => {
    const matchesCategory = selected === "전체" || card.category === selected;
    const matchesQuery =
      !deferredQuery ||
      `${card.question} ${card.answer}`.toLocaleLowerCase("ko").includes(deferredQuery);
    return matchesCategory && matchesQuery;
  });

  function toggleLike(id: string) {
    setLikedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="lg:-mx-8 xl:-mx-32">
      <header>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-clay">Discover</p>
            <h1 className="mt-1 text-3xl font-bold text-ink">탐색</h1>
          </div>
          <IconButton
            className="ml-auto"
            label={searching ? "검색 닫기" : "생각 검색"}
            active={searching}
            icon={searching ? <X /> : <Search />}
            onClick={() => setSearching((value) => !value)}
          />
        </div>

        {searching && (
          <div className="relative mt-5 animate-fade-up">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 w-full rounded-lg bg-paper-card pl-11 pr-4 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:ring-1 focus:ring-clay/60"
              placeholder="질문이나 답변 속 문장을 찾아보세요"
            />
          </div>
        )}

        <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
          {EXPLORE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelected(category)}
              aria-pressed={selected === category}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                selected === category
                  ? "bg-clay text-paper"
                  : "bg-paper-card text-ink-soft hover:text-ink",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-12"
          title="아직 발견된 생각이 없어요"
          description="검색어를 바꾸거나 다른 카테고리를 둘러보세요."
          icon={<Search />}
        />
      ) : (
        <div className="mt-8 columns-1 gap-4 min-[480px]:columns-2 lg:columns-3">
          {filtered.map((card) => {
            const liked = likedIds.has(card.id);
            return (
              <article
                key={card.id}
                className="mb-4 break-inside-avoid overflow-hidden rounded-lg bg-paper-card shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-card"
              >
                <Link href={`/feed/${card.id}`} className="block p-4 sm:p-5">
                  <header className="flex items-center gap-2.5">
                    <Avatar label={card.gender} size="sm" />
                    <span className="text-xs font-medium text-ink-soft">{card.gender}</span>
                    <Tag className="ml-auto">{card.category}</Tag>
                  </header>
                  <h2 className="mt-5 break-words text-base font-bold leading-[1.5] text-ink">
                    {card.question}
                  </h2>
                  <p className="mt-3 break-words text-sm leading-[1.75] text-ink-soft">
                    {card.answer}
                  </p>
                </Link>
                <footer className="flex items-center px-3 pb-3">
                  <button
                    type="button"
                    onClick={() => toggleLike(card.id)}
                    aria-label={liked ? "공감 취소" : "공감하기"}
                    aria-pressed={liked}
                    className={cn(
                      "inline-flex h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium transition active:scale-95",
                      liked ? "text-clay" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    <Heart className={cn("h-4 w-4", liked && "animate-pop fill-current")} />
                    {liked ? "공감함" : "공감"}
                  </button>
                  <span className="ml-auto text-[11px] text-ink-soft/70">{card.createdAt}</span>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}