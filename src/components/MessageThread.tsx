"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/app/actions";
import type { Message } from "@/lib/types";
import { relativeTime } from "@/lib/format";

export default function MessageThread({
  partnerId,
  partnerLabel,
  messages,
}: {
  partnerId: string;
  partnerLabel: string;
  messages: Message[];
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function onSend(e: React.FormEvent) {
    e.preventDefault();
    const body = value.trim();
    if (!body) return;
    setError(null);
    startTransition(async () => {
      const res = await sendMessage(partnerId, body);
      if (!res.ok) {
        setError(res.error ?? "문제가 발생했어요.");
        return;
      }
      setValue("");
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-[70dvh] flex-col">
      <div className="flex-1 space-y-3 pb-4">
        {messages.length === 0 ? (
          <p className="card p-7 text-center text-sm text-ink-soft">
            {partnerLabel}님에게 첫 쪽지를 남겨보세요.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.mine ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                  m.mine
                    ? "bg-ember text-black"
                    : "border border-line bg-paper-card text-ink"
                }`}
              >
                {m.body}
              </div>
              <span className="meta mt-1 px-1">{relativeTime(m.created_at)}</span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={onSend}
        className="sticky bottom-16 flex items-end gap-2 border-t border-line bg-paper/80 pt-3 backdrop-blur md:bottom-0"
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, 1000))}
          placeholder="따뜻한 한마디를 건네보세요…"
          rows={2}
          className="field flex-1 resize-none text-[15px]"
        />
        <button type="submit" disabled={pending || !value.trim()} className="btn-primary">
          {pending ? "…" : "보내기"}
        </button>
      </form>
      {error && <p className="mt-1 text-sm text-clay">{error}</p>}
    </div>
  );
}
