"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitAnswer } from "@/app/actions";
import { ANSWER_MAX_LENGTH, ANSWER_MIN_LENGTH } from "@/lib/types";
import { countChars } from "@/lib/format";

export default function AnswerComposer({ questionId }: { questionId: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const count = countChars(value);
  const tooShort = count < ANSWER_MIN_LENGTH;
  const remaining = ANSWER_MAX_LENGTH - count;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await submitAnswer(questionId, value);
      if (!res.ok) {
        setError(res.error ?? "문제가 발생했어요.");
        return;
      }
      setValue("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="card mt-4 rounded-xl3 p-6">
      <p className="meta mb-2 text-sage">나에게 쓰듯이, 오늘의 생각</p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, ANSWER_MAX_LENGTH))}
        placeholder="솔직하게, 나에게 쓰듯이 남겨보세요…"
        rows={7}
        className="w-full resize-none bg-transparent font-body text-base leading-[1.75] text-ink placeholder:text-ink-soft/50 focus:outline-none"
      />
      <div className="mt-3 flex items-center justify-between border-t border-line pt-4">
        <span className={`meta ${tooShort ? "text-clay" : "text-sage"}`}>
          {tooShort
            ? `최소 ${ANSWER_MIN_LENGTH}자 · ${ANSWER_MIN_LENGTH - count}자 남음`
            : `${count}자 · ${remaining}자 여유`}
        </span>
        <button
          type="submit"
          disabled={pending || tooShort}
          className="btn-primary"
        >
          {pending ? "게시 중…" : "피드에 남기기"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-clay">{error}</p>}
    </form>
  );
}
