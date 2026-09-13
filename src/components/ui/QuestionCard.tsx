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
        "relative overflow-hidden rounded-lg bg-paper-card px-5 py-6 shadow-card sm:px-7 sm:py-8",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-x-0 top-0 h-0.5 bg-clay" aria-hidden />
      <div className="mb-5 flex items-center gap-2">
        <Tag tone="accent">{eyebrow}</Tag>
      </div>
      <h2 className="max-w-[26ch] font-voice text-[clamp(1.45rem,5vw,2rem)] font-bold leading-[1.5] text-ink">
        {question}
      </h2>
      {meta && <div className="mt-5 text-xs text-ink-soft">{meta}</div>}
    </section>
  );
}