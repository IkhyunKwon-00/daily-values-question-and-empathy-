import type { HTMLAttributes, ReactNode } from "react";
import Tag from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

export type QuestionCardProps = HTMLAttributes<HTMLElement> & {
  question: string;
  eyebrow?: string;
  meta?: ReactNode;
};

export default function QuestionCard({
  className,
  question,
  eyebrow = "오늘의 질문",
  meta,
  ...props
}: QuestionCardProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-lg bg-paper-card px-4 py-4 shadow-soft sm:px-5 sm:py-5",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-x-0 top-0 h-0.5 bg-clay" aria-hidden />
      <div className="mb-3 flex items-center gap-2">
        <Tag tone="accent">{eyebrow}</Tag>
      </div>
      <h2 className="max-w-[34ch] font-voice text-[clamp(1.05rem,3vw,1.35rem)] font-bold leading-[1.5] text-ink">
        {question}
      </h2>
      {meta && <div className="mt-3 text-[11px] text-ink-soft">{meta}</div>}
    </section>
  );
}