"use client";

import { useState } from "react";

export default function LikesTabs({
  cards,
  authors,
}: {
  cards: React.ReactNode;
  authors: React.ReactNode;
}) {
  const [tab, setTab] = useState<"cards" | "authors">("cards");

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-lg border border-line bg-paper-card p-1">
        <button
          type="button"
          onClick={() => setTab("cards")}
          className={`min-h-11 flex-1 rounded-md px-4 py-2 text-sm transition-colors ${
            tab === "cards" ? "bg-ink text-paper-card" : "text-ink-soft"
          }`}
        >
          공감한 답변
        </button>
        <button
          type="button"
          onClick={() => setTab("authors")}
          className={`min-h-11 flex-1 rounded-md px-4 py-2 text-sm transition-colors ${
            tab === "authors" ? "bg-ink text-paper-card" : "text-ink-soft"
          }`}
        >
          작성자
        </button>
      </div>

      {tab === "cards" ? cards : authors}
    </div>
  );
}
