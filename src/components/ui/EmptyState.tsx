import type { HTMLAttributes, ReactNode } from "react";
import { MessageSquareText } from "lucide-react";
import { cn } from "@/lib/cn";

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export default function EmptyState({
  className,
  title,
  description,
  icon = <MessageSquareText />,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center px-6 py-12 text-center", className)}
      {...props}
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.05] text-ink-soft [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </span>
      <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}