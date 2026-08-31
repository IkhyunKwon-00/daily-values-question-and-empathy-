"use client";

import ExploreCard from "@/components/ExploreCard";
import type { ExploreCard as ExploreCardType } from "@/lib/types";

export default function ExploreFeed({ cards }: { cards: ExploreCardType[] }) {
  if (cards.length === 0) {
    return (
      <div className="card p-7 text-center text-sm text-ink-soft">
        아직 둘러볼 답변이 없어요. 조금만 기다려 주세요.
      </div>
    );
  }

  return (
    <div className="columns-2 gap-3 [column-fill:_balance]">
      {cards.map((card) => (
        <div key={card.id} className="mb-4 break-inside-avoid">
          <ExploreCard card={card} />
        </div>
      ))}
    </div>
  );
}
