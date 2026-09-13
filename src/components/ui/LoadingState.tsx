import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type LoadingStateProps = HTMLAttributes<HTMLDivElement> & {
  items?: number;
};

export default function LoadingState({
  className,
  items = 3,
  ...props
}: LoadingStateProps) {
  return (
    <div className={cn("space-y-4", className)} aria-label="불러오는 중" {...props}>
      {Array.from({ length: items }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg bg-paper-card px-5 py-6"
          aria-hidden
        >
          <div className="h-3 w-20 rounded-full bg-paper-raise" />
          <div className="mt-5 h-4 w-full rounded-full bg-paper-raise" />
          <div className="mt-3 h-4 w-4/5 rounded-full bg-paper-raise" />
          <div className="mt-6 h-8 w-8 rounded-full bg-paper-raise" />
        </div>
      ))}
    </div>
  );
}