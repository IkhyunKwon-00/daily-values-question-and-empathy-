import type { Question } from "@/lib/types";

export default function QuestionCard({
  question,
  index,
}: {
  question: Pick<Question, "text" | "category">;
  index?: string;
}) {
  return (
    <section className="card relative overflow-hidden rounded-xl3 p-7">
      <span
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-ember opacity-15 blur-2xl"
        aria-hidden
      />
      <p className="mb-4 flex items-center gap-2">
        <span className="chip bg-ember text-white shadow-pop">오늘의 질문</span>
        {index && <span className="meta">· {index}</span>}
        <span className="chip ml-auto bg-line/60 text-ink-soft">
          {question.category}
        </span>
      </p>
      <h1 className="font-voice text-2xl leading-relaxed text-ink md:text-[28px]">
        {question.text}
      </h1>
    </section>
  );
}
