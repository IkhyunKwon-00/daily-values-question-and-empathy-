"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleLike } from "@/app/actions";
import type { ExploreCard as ExploreCardType } from "@/lib/types";
import { relativeTime } from "@/lib/format";
import { categoryStyle, genderLabel } from "@/lib/category";

export default function ExploreCard({ card }: { card: ExploreCardType }) {
  const router = useRouter();
  const [liked, setLiked] = useState(card.liked_by_me);
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);

  const style = categoryStyle(card.question_category);
  const gender = genderLabel(card.author_gender);

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
    <article className="card relative animate-fade-up overflow-hidden rounded-xl3 p-6 transition-transform duration-200 hover:-translate-y-0.5">
      <header className="mb-4 flex items-center gap-2">
        <span className={`chip ${style.chip}`}>{card.question_category}</span>
        <span className="meta ml-auto">{relativeTime(card.created_at)}</span>
      </header>

      <p className="font-voice text-xl leading-snug text-ink">
        {card.question_text}
      </p>
      <p className="mt-3 whitespace-pre-wrap font-body text-[15px] leading-[1.75] text-ink-soft">
        {card.content}
      </p>

      <footer className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <span
          className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${style.ring} p-[2px]`}
        >
          <span className="grid h-full w-full place-items-center rounded-full bg-paper-card font-mono text-xs text-ink-soft">
            {gender[0]}
          </span>
        </span>
        <span className="text-sm text-ink-soft">{gender}</span>

        <button
          type="button"
          onClick={onLike}
          disabled={pending}
          aria-pressed={liked}
          aria-label={liked ? "공감 취소" : "공감하기"}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
            liked
              ? "bg-ember text-white shadow-pop"
              : "border border-line text-ink-soft hover:bg-line/40"
          }`}
        >
          <span
            key={liked ? "on" : "off"}
            className={`text-base leading-none ${liked ? "animate-pop" : ""}`}
            aria-hidden
          >
            {liked ? "♥" : "♡"}
          </span>
          공감
        </button>
      </footer>

      {notice && <p className="mt-2 text-xs text-clay">{notice}</p>}
    </article>
  );
}
