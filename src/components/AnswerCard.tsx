"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleLike, reportAnswer } from "@/app/actions";
import { GENDER_LABEL, type FeedAnswer } from "@/lib/types";
import { relativeTime } from "@/lib/format";

export default function AnswerCard({ answer }: { answer: FeedAnswer }) {
  const router = useRouter();
  const [liked, setLiked] = useState(answer.liked_by_me);
  const [pending, startTransition] = useTransition();
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const genderLabel = answer.author_gender
    ? GENDER_LABEL[answer.author_gender]
    : "익명";

  function onLike() {
    setNotice(null);
    const prev = liked;
    setLiked(!prev); // optimistic
    startTransition(async () => {
      const res = await toggleLike(answer.id, answer.user_id, prev);
      if (!res.ok) {
        setLiked(prev);
        setNotice(res.error ?? "문제가 발생했어요.");
      } else {
        router.refresh();
      }
    });
  }

  function onReport(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await reportAnswer(answer.id, answer.user_id, reason);
      if (!res.ok) {
        setNotice(res.error ?? "문제가 발생했어요.");
        return;
      }
      setReporting(false);
      setReason("");
      setNotice("신고가 접수되었어요.");
    });
  }

  return (
    <article className="card p-5">
      <header className="mb-3 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-paper-raise text-xs text-ink-soft">
          {genderLabel[0]}
        </span>
        <span className="text-sm text-ink-soft">{genderLabel}</span>
        <span className="meta ml-auto">{relativeTime(answer.created_at)}</span>
      </header>

      <p className="whitespace-pre-wrap font-body text-[15px] leading-[1.75] text-ink">
        {answer.content}
      </p>

      <footer className="mt-4 flex items-center gap-3 border-t border-line pt-3">
        <button
          type="button"
          onClick={onLike}
          disabled={pending}
          aria-pressed={liked}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
            liked
              ? "bg-ember text-black shadow-pop"
              : "border border-line text-ink-soft hover:bg-white/5"
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
        <button
          type="button"
          onClick={() => setReporting((v) => !v)}
          className="ml-auto text-xs text-ink-soft/70 hover:text-clay"
        >
          신고
        </button>
      </footer>

      {reporting && (
        <form onSubmit={onReport} className="mt-3 space-y-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="신고 사유 (욕설, 성희롱, 외모 비하 등)"
            className="field text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReporting(false)}
              className="btn-ghost text-sm"
            >
              취소
            </button>
            <button type="submit" disabled={pending} className="btn-primary text-sm">
              신고 접수
            </button>
          </div>
        </form>
      )}

      {notice && <p className="mt-2 text-xs text-sage">{notice}</p>}
    </article>
  );
}
