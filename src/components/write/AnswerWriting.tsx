"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { submitAnswer } from "@/app/actions";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { countChars } from "@/lib/format";
import { PUBLISHED_ANSWER_KEY, WRITE_DRAFT_KEY } from "@/lib/mock-storage";
import { ANSWER_MAX_LENGTH, type Question } from "@/lib/types";

type Draft = {
  questionId?: string;
  answer?: string;
};

export default function AnswerWriting({ question }: { question: Question }) {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const stored = window.localStorage.getItem(WRITE_DRAFT_KEY);
    if (stored) {
      const draft = JSON.parse(stored) as Draft;
      if (!draft.questionId || draft.questionId === question.id) {
        setAnswer(draft.answer ?? "");
      }
    }
    setHydrated(true);
  }, [question.id]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      WRITE_DRAFT_KEY,
      JSON.stringify({ questionId: question.id, answer } satisfies Draft),
    );
  }, [answer, hydrated, question.id]);

  const count = countChars(answer);
  const canPublish = count > 0 && count <= ANSWER_MAX_LENGTH;

  function updateAnswer(value: string) {
    setAnswer(Array.from(value).slice(0, ANSWER_MAX_LENGTH).join(""));
    setError(null);
  }

  function publish() {
    if (!canPublish) return;
    setError(null);
    startTransition(async () => {
      const result = await submitAnswer(question.id, answer);
      if (!result.ok) {
        setError(result.error ?? "답변을 올리지 못했어요.");
        setPreviewOpen(false);
        return;
      }

      window.localStorage.setItem(
        PUBLISHED_ANSWER_KEY,
        JSON.stringify({ question: question.text, answer: answer.trim() }),
      );
      window.localStorage.removeItem(WRITE_DRAFT_KEY);
      router.push("/");
      router.refresh();
    });
  }

  return (
    <form
      className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-[42rem] flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        publish();
      }}
    >
      <header className="sticky top-0 z-20 -mx-5 flex h-14 items-center bg-paper/90 px-4 backdrop-blur-xl sm:-mx-8 sm:px-7">
        <Link
          href="/"
          aria-label="홈으로 돌아가기"
          className="grid h-11 w-11 place-items-center rounded-lg text-ink-soft transition hover:bg-white/[0.05] hover:text-ink"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="ml-2 text-sm font-semibold text-ink">작성</span>
      </header>

      <section className="pt-8 sm:pt-12">
        <p className="text-xs font-semibold uppercase text-ink-soft">오늘의 질문</p>
        <h1 className="mt-4 max-w-[22ch] break-words font-voice text-[clamp(1.8rem,6vw,2.75rem)] font-bold leading-[1.4] text-ink">
          {question.text}
        </h1>
      </section>

      <section className="mt-10 flex flex-1 flex-col">
        <label htmlFor="answer" className="text-sm text-ink-soft">
          조금 솔직하게 적어도 괜찮아요.
        </label>
        <textarea
          id="answer"
          autoFocus
          value={answer}
          maxLength={ANSWER_MAX_LENGTH}
          onChange={(event) => updateAnswer(event.target.value)}
          placeholder="당신의 생각을 들려주세요."
          className="mt-4 min-h-72 flex-1 resize-none border-y border-line/70 bg-transparent py-7 font-body text-xl leading-[1.9] text-ink outline-none placeholder:text-ink-soft/40 focus:border-clay sm:min-h-80 sm:text-2xl"
        />
        <div className="mt-3 flex justify-end text-xs text-ink-soft">
          <span className={count >= 450 ? "text-clay" : undefined}>
            {count} / {ANSWER_MAX_LENGTH}
          </span>
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-rose">{error}</p>}
      </section>

      <footer className="sticky bottom-16 -mx-5 mt-8 grid grid-cols-2 gap-3 border-t border-line/70 bg-paper/95 px-5 py-4 backdrop-blur-xl lg:bottom-0 sm:-mx-8 sm:px-8">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          disabled={!canPublish || pending}
          onClick={() => setPreviewOpen(true)}
        >
          미리보기
        </Button>
        <Button type="submit" size="lg" loading={pending} disabled={!canPublish}>
          답변 올리기
        </Button>
      </footer>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="답변 미리보기"
        description={question.text}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setPreviewOpen(false)}>
              계속 쓰기
            </Button>
            <Button type="button" loading={pending} onClick={publish}>
              답변 올리기
            </Button>
          </>
        }
      >
        <p className="whitespace-pre-wrap font-body text-lg leading-[1.9]">{answer}</p>
      </Modal>
    </form>
  );
}