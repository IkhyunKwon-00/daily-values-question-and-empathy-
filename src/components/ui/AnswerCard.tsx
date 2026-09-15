import type { HTMLAttributes, ReactNode } from "react";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";

export type AnswerCardProps = HTMLAttributes<HTMLElement> & {
  answer: string;
  authorLabel?: string;
  meta?: ReactNode;
  actions?: ReactNode;
};

export default function AnswerCard({
  className,
  answer,
  authorLabel = "익명의 생각",
  meta,
  actions,
  ...props
}: AnswerCardProps) {
  return (
    <article
      className={cn("rounded-lg bg-paper-card px-5 py-5 sm:px-6", className)}
      {...props}
    >
      <header className="mb-5 flex items-center gap-3">
        <Avatar label={authorLabel} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{authorLabel}</p>
          {meta && <div className="mt-0.5 text-xs text-ink-soft">{meta}</div>}
        </div>
      </header>

      <p className="max-w-[42rem] whitespace-pre-wrap font-body text-[15px] leading-[1.85] text-ink sm:text-base">
        {answer}
      </p>

      {actions && <footer className="mt-5 flex items-center gap-1">{actions}</footer>}
    </article>
  );
}