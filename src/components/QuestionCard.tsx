import type { Question } from "@/lib/types";

export default function QuestionCard({
  question,
  index,
}: {
  question: Pick<Question, "text" | "category">;
  index?: string;
}) {
  return (
    <section className="card p-6">
      <p className="mb-3 flex items-center gap-2">
        <span className="chip bg-ember text-black">오늘의 질문</span>
        {index && <span className="meta">· {index}</span>}
        <span className="meta ml-auto">{question.category}</span>
      </p>
      <h1 className="text-[26px] font-bold leading-snug tracking-tight text-ink">
        {question.text}
      </h1>
    </section>
  );
}
