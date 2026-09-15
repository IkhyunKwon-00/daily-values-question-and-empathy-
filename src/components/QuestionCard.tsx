import type { Question } from "@/lib/types";

export default function QuestionCard({
  question,
  index,
}: {
  question: Pick<Question, "text">;
  index?: string;
}) {
  return (
    <section className="card p-6">
      <p className="mb-3 flex items-center gap-2">
        <span className="chip bg-paper-raise text-ink-soft">오늘의 질문</span>
        {index && <span className="meta">· {index}</span>}
      </p>
      <h1 className="font-voice text-2xl font-bold leading-[1.5] text-ink">
        {question.text}
      </h1>
    </section>
  );
}
