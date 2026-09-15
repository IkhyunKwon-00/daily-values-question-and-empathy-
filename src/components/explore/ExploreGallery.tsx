"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowRight, Heart, Shuffle } from "lucide-react";
import { toggleLike as toggleLikeAction } from "@/app/actions";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";
import { MOCK_EXPLORE_CARDS, type MockExploreCard } from "@/lib/mock-explore";
import { PUBLISHED_ANSWER_KEY, type PublishedMockAnswer } from "@/lib/mock-storage";

const SWIPE_THRESHOLD = 96;

export default function ExploreGallery() {
  const [likedIds, setLikedIds] = useState(
    () => new Set(MOCK_EXPLORE_CARDS.filter((card) => card.liked).map((card) => card.id)),
  );
  const [publishedCard, setPublishedCard] = useState<MockExploreCard | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<-1 | 1 | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const pointer = useRef({ startX: 0, startY: 0, moved: false });

  useEffect(() => {
    const stored = window.localStorage.getItem(PUBLISHED_ANSWER_KEY);
    if (stored) {
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
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(media.matches);
    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);
    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  const cards = publishedCard
    ? [publishedCard, ...MOCK_EXPLORE_CARDS]
    : MOCK_EXPLORE_CARDS;
  const currentCard = cards[currentIndex % cards.length];
  const nextCard = cards[(currentIndex + 1) % cards.length];

  function setLike(card: MockExploreCard, liked: boolean) {
    const wasLiked = likedIds.has(card.id);
    if (wasLiked === liked) return;

    setLikedIds((current) => {
      const next = new Set(current);
      if (liked) next.add(card.id);
      else next.delete(card.id);
      return next;
    });

    startTransition(async () => {
      const result = await toggleLikeAction(card.id, card.userId, wasLiked);
      if (result.ok) return;
      setLikedIds((current) => {
        const next = new Set(current);
        if (wasLiked) next.add(card.id);
        else next.delete(card.id);
        return next;
      });
      setNotice(result.error ?? "관심을 보내지 못했어요.");
    });
  }

  function showNext(direction: -1 | 1, step = 1) {
    if (exitDirection || cards.length < 2) return;
    setDragging(false);
    setExitDirection(direction);

    window.setTimeout(() => {
      setCurrentIndex((index) => (index + step) % cards.length);
      setDragX(0);
      setExitDirection(null);
      setNotice("새로운 생각을 보여드려요.");
    }, reducedMotion ? 0 : 220);
  }

  function likeAndContinue() {
    if (!currentCard) return;
    setLike(currentCard, true);
    showNext(1);
  }

  function onPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (!event.isPrimary || exitDirection) return;
    pointer.current = { startX: event.clientX, startY: event.clientY, moved: false };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    if (!dragging) return;
    const deltaX = event.clientX - pointer.current.startX;
    const deltaY = event.clientY - pointer.current.startY;
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaX) < 12) return;
    pointer.current.moved = pointer.current.moved || Math.abs(deltaX) > 8;
    setDragX(deltaX);
  }

  function onPointerUp(event: React.PointerEvent<HTMLElement>) {
    if (!dragging) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    const finalX = event.clientX - pointer.current.startX;

    if (finalX >= SWIPE_THRESHOLD) likeAndContinue();
    else if (finalX <= -SWIPE_THRESHOLD) showNext(-1);
    else setDragX(0);
  }

  if (!currentCard) {
    return (
      <EmptyState
        title="지금 보여드릴 생각이 없어요"
        description="새로운 답변이 도착하면 이곳에서 만날 수 있어요."
      />
    );
  }

  const liked = likedIds.has(currentCard.id);
  const currentTransform = exitDirection
    ? `translate3d(${exitDirection * 110}vw, 0, 0)`
    : `translate3d(${dragX}px, 0, 0)`;
  const dragProgress = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1);

  return (
    <div className="mx-auto max-w-xl pb-4">
      <header>
        <p className="text-xs font-semibold uppercase text-ink-soft">Explore</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">탐색</h1>
        <p className="mt-3 text-base text-ink-soft">오늘의 생각을 만나보세요</p>
      </header>

      <div className="relative mt-8 h-[31rem] sm:h-[32rem]">
        {cards.length > 1 && (
          <article
            aria-hidden
            className={cn(
              "absolute inset-x-3 top-0 h-[29rem] rounded-lg bg-paper-raise sm:h-[30rem]",
              !dragging && "transition-transform duration-200 ease-out motion-reduce:transition-none",
            )}
            style={{
              transform: `translateY(${12 - dragProgress * 12}px) scale(${0.97 + dragProgress * 0.03})`,
            }}
          >
            <div className="p-7 opacity-30">
              <p className="font-voice text-xl font-bold text-ink">{nextCard.question}</p>
            </div>
          </article>
        )}

        <article
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            setDragging(false);
            setDragX(0);
          }}
          className={cn(
            "absolute inset-x-0 top-0 flex h-[29rem] cursor-grab touch-pan-y select-none flex-col overflow-hidden rounded-lg bg-paper-card p-7 shadow-card active:cursor-grabbing sm:h-[30rem] sm:p-9",
            !dragging && "transition-transform duration-200 ease-out motion-reduce:transition-none",
          )}
          style={{ transform: currentTransform }}
        >
          <Link
            href={`/feed/${currentCard.id}`}
            draggable={false}
            aria-label={`${currentCard.question} 답변 상세 보기`}
            aria-describedby="explore-controls-help"
            className="absolute inset-0 z-10 rounded-lg"
            onClick={(event) => {
              if (pointer.current.moved) event.preventDefault();
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                showNext(-1);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                likeAndContinue();
              }
            }}
          />
          <div>
            <p className="text-xs font-semibold uppercase text-ink-soft">질문</p>
            <h2 className="mt-4 line-clamp-4 break-words font-voice text-2xl font-bold leading-[1.45] text-ink sm:text-3xl">
              {currentCard.question}
            </h2>
          </div>
          <div className="my-7 h-px w-10 bg-line" aria-hidden />
          <p className="line-clamp-6 break-words font-body text-lg leading-[1.85] text-ink sm:text-xl">
            {currentCard.answer}
          </p>
          <footer className="mt-auto flex items-center text-sm text-ink-soft">
            <span>{currentCard.gender}</span>
            <span className="mx-2" aria-hidden>·</span>
            <span>{currentCard.createdAt}</span>
          </footer>
        </article>
        </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
        <Button
          className="min-w-0 !px-2 sm:!px-5"
          variant="ghost"
          disabled={Boolean(exitDirection)}
          onClick={() => showNext(-1)}
        >
          다음
          <ArrowRight className="h-4 w-4" />
        </Button>
        <button
          type="button"
          disabled={pending || Boolean(exitDirection)}
          aria-label={liked ? "관심 취소" : "관심 보내기"}
          aria-pressed={liked}
          onClick={() => setLike(currentCard, !liked)}
          className={cn(
            "grid h-14 w-14 place-items-center rounded-full border border-line text-ink-soft transition active:scale-95 disabled:opacity-50",
            liked && "border-clay bg-clay text-paper",
          )}
        >
          <Heart className={cn("h-6 w-6", liked && "fill-current")} strokeWidth={1.8} />
        </button>
        <Button
          className="min-w-0 !px-2 sm:!px-5"
          variant="ghost"
          disabled={Boolean(exitDirection)}
          onClick={() => showNext(-1, Math.min(2, cards.length - 1))}
        >
          <Shuffle className="h-4 w-4" />
          다른 생각
        </Button>
      </div>

      <p id="explore-controls-help" className="sr-only">
        오른쪽으로 넘기면 마음에 들어요, 왼쪽으로 넘기면 다음 생각을 표시합니다. 아래 버튼으로도 조작할 수 있습니다.
      </p>
      <p role="status" className="sr-only">{notice}</p>
    </div>
  );
}