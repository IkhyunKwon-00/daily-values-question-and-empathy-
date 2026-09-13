import type { HTMLAttributes, ReactNode } from "react";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";

export type ExploreCardProps = HTMLAttributes<HTMLElement> & {
  question: string;
  answer: string;
  authorLabel?: string;
  action?: ReactNode;
};

export default function ExploreCard({
  className,
  question,
  answer,
  authorLabel = "익명",
  action,
  ...props
}: ExploreCardProps) {
  return (
    <article
      className={cn(
        "break-inside-avoid rounded-lg bg-paper-card p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-card",
        className,
      )}
      {...props}
    >
      <h3 className="font-voice text-lg font-bold leading-[1.5] text-ink">{question}</h3>
      <p className="mt-3 whitespace-pre-wrap font-body text-sm leading-[1.8] text-ink-soft">
        {answer}
      </p>
      <footer className="mt-5 flex items-center gap-2">
        <Avatar label={authorLabel} size="sm" />
        <span className="truncate text-xs text-ink-soft">{authorLabel}</span>
        {action && <span className="ml-auto">{action}</span>}
      </footer>
    </article>
  );
}