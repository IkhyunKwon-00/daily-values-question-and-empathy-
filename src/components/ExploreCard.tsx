"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleLike } from "@/app/actions";
import type { ExploreCard as ExploreCardType } from "@/lib/types";
import { genderShort } from "@/lib/category";

export default function ExploreCard({ card }: { card: ExploreCardType }) {
  const router = useRouter();
  const [liked, setLiked] = useState(card.liked_by_me);
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);

  function onLike() {
    setNotice(null);
    const prev = liked;
    setLiked(!prev); // optimistic
    startTransition(async () => {
      const res = await toggleLike(card.id, card.user_id, prev);
      if (!res.ok) {
        setLiked(prev);
        setNotice(res.error ?? "문제가 발생했어요.");
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="animate-fade-up">
      <article className="card p-4">
        <p className="text-[15px] font-bold leading-snug tracking-tight text-ink">
          {card.question_text}
        </p>
        <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-ink-soft">
          {card.content}
        </p>
      </article>

      <div className="mt-2 flex items-center gap-2 px-1">
        <span className="text-[13px] text-ink">
          {card.author_name}
          <span className="ml-1 text-ink-soft">
            {genderShort(card.author_gender)}
          </span>
        </span>
        <button
          type="button"
          onClick={onLike}
          disabled={pending}
          aria-pressed={liked}
          aria-label={liked ? "공감 취소" : "공감하기"}
          className={`ml-auto grid h-8 w-8 place-items-center rounded-full transition active:scale-95 ${
            liked ? "text-clay" : "text-ink-soft hover:text-ink"
          }`}
        >
          <span
            key={liked ? "on" : "off"}
            className={`text-lg leading-none ${liked ? "animate-pop" : ""}`}
            aria-hidden
          >
            {liked ? "♥" : "♡"}
          </span>
        </button>
      </div>

      {notice && <p className="mt-1 px-1 text-xs text-clay">{notice}</p>}
    </div>
  );
}
