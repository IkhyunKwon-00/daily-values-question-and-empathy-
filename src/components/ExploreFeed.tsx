"use client";

import { useMemo, useState } from "react";
import ExploreCard from "@/components/ExploreCard";
import type { ExploreCard as ExploreCardType } from "@/lib/types";
import { categoryStyle } from "@/lib/category";

export default function ExploreFeed({ cards }: { cards: ExploreCardType[] }) {
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const c of cards) {
      if (c.question_category && !seen.includes(c.question_category)) {
        seen.push(c.question_category);
      }
    }
    return seen;
  }, [cards]);

  const [active, setActive] = useState<string>("전체");
  const visible =
    active === "전체"
      ? cards
      : cards.filter((c) => c.question_category === active);

  return (
    <div className="space-y-4">
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <StoryChip
          label="전체"
          ring="from-clay to-rose"
          active={active === "전체"}
          onClick={() => setActive("전체")}
        />
        {categories.map((cat) => (
          <StoryChip
            key={cat}
            label={cat}
            ring={categoryStyle(cat).ring}
            active={active === cat}
            onClick={() => setActive(cat)}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="card p-7 text-center text-sm text-ink-soft">
          이 결의 답변이 아직 없어요.
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((card) => (
            <ExploreCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

function StoryChip({
  label,
  ring,
  active,
  onClick,
}: {
  label: string;
  ring: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 flex-col items-center gap-1"
    >
      <span
        className={`grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br p-[2px] transition ${ring} ${
          active ? "" : "opacity-45"
        }`}
      >
        <span className="grid h-full w-full place-items-center rounded-full bg-paper-card font-voice text-sm text-ink">
          {label[0]}
        </span>
      </span>
      <span className={`text-[11px] ${active ? "text-ink" : "text-ink-soft"}`}>
        {label}
      </span>
    </button>
  );
}
