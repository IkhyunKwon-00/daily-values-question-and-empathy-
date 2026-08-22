"use client";

import { useState } from "react";

export default function LikesTabs({
  cardCount,
  authorCount,
  cards,
  authors,
}: {
  cardCount: number;
  authorCount: number;
  cards: React.ReactNode;
  authors: React.ReactNode;
}) {
  const [tab, setTab] = useState<"cards" | "authors">("cards");

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-full border border-line bg-paper-card p-1">
        <button
          type="button"
          onClick={() => setTab("cards")}
          className={`flex-1 rounded-full px-4 py-1.5 text-sm transition-colors ${
            tab === "cards" ? "bg-ink text-paper-card" : "text-ink-soft"
          }`}
        >
          공감한 답변 {cardCount}
        </button>
        <button
          type="button"
          onClick={() => setTab("authors")}
          className={`flex-1 rounded-full px-4 py-1.5 text-sm transition-colors ${
            tab === "authors" ? "bg-ink text-paper-card" : "text-ink-soft"
          }`}
        >
          작성자 {authorCount}
        </button>
      </div>

      {tab === "cards" ? cards : authors}
    </div>
  );
}
