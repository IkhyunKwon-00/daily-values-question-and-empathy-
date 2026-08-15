import type { Question } from "@/lib/types";

export default function QuestionCard({
  question,
  index,
}: {
  question: Pick<Question, "text" | "category">;
  index?: string;
}) {
  return (
    <section className="card p-7">
      <p className="meta mb-4 flex items-center gap-2">
        <span className="text-clay">오늘의 질문</span>
        {index && <span className="text-ink-soft/60">· {index}</span>}
        <span className="ml-auto rounded-full border border-line px-2 py-0.5 text-ink-soft/80">
          {question.category}
        </span>
      </p>
      <h1 className="font-voice text-2xl leading-relaxed text-ink md:text-3xl">
        {question.text}
      </h1>
    </section>
  );
}
