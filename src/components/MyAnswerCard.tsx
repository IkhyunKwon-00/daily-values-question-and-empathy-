"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { editAnswer } from "@/app/actions";
import type { MyAnswer } from "@/lib/data";
import { ANSWER_MAX_LENGTH, ANSWER_MIN_LENGTH } from "@/lib/types";
import { relativeTime, countChars } from "@/lib/format";

export default function MyAnswerCard({ answer }: { answer: MyAnswer }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(answer.content);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const count = countChars(value);
  const tooShort = count < ANSWER_MIN_LENGTH;

  function onSave() {
    setError(null);
    startTransition(async () => {
      const res = await editAnswer(answer.id, value);
      if (!res.ok) {
        setError(res.error ?? "문제가 발생했어요.");
        return;
      }
      setEditing(false);
      router.refresh();
    });
  }

  function onCancel() {
    setValue(answer.content);
    setError(null);
    setEditing(false);
  }

  return (
    <article className="py-9 sm:py-11">
      <header className="mb-4 flex items-start gap-4">
        <h3 className="max-w-[30ch] font-voice text-xl font-bold leading-[1.55] text-ink sm:text-2xl">
          {answer.question_text}
        </h3>
        <time className="meta ml-auto shrink-0">{relativeTime(answer.created_at)}</time>
      </header>

      {editing ? (
        <div className="mt-5">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, ANSWER_MAX_LENGTH))}
            rows={6}
            className="w-full resize-none rounded-lg border border-line bg-paper px-4 py-3 font-body text-[15px] leading-relaxed text-ink focus:border-clay focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className={`meta ${tooShort ? "text-clay" : "text-sage"}`}>
              {tooShort
                ? `최소 ${ANSWER_MIN_LENGTH}자 · ${ANSWER_MIN_LENGTH - count}자 남음`
                : `${count}자`}
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={onCancel} className="btn-ghost text-sm">
                취소
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={pending || tooShort}
                className="btn-primary text-sm"
              >
                {pending ? "저장 중…" : "저장"}
              </button>
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-clay">{error}</p>}
        </div>
      ) : (
        <>
          <p className="whitespace-pre-wrap font-body text-lg leading-[1.85] text-ink sm:text-xl">
            {answer.content}
          </p>
          <footer className="mt-5 flex items-center">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="ml-auto inline-flex h-11 items-center px-2 text-xs text-ink-soft/80 hover:text-clay"
            >
              수정
            </button>
          </footer>
        </>
      )}
    </article>
  );
}
