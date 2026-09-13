import type { HTMLAttributes, ReactNode } from "react";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

export type ExploreCardProps = HTMLAttributes<HTMLElement> & {
  question: string;
  answer: string;
  category?: string;
  authorLabel?: string;
  action?: ReactNode;
};

export default function ExploreCard({
  className,
  question,
  answer,
  category,
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
      {category && <Tag className="mb-4">{category}</Tag>}
      <h3 className="text-base font-bold leading-[1.45] text-ink">{question}</h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-[1.75] text-ink-soft">
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