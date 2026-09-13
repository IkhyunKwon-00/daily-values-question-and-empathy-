import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TopNavigationProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  subtitle?: string;
  leading?: ReactNode;
  actions?: ReactNode;
  sticky?: boolean;
};

export default function TopNavigation({
  className,
  title,
  subtitle,
  leading,
  actions,
  sticky = true,
  ...props
}: TopNavigationProps) {
  return (
    <header
      className={cn(
        "z-20 bg-paper/90 backdrop-blur-xl",
        sticky && "sticky top-0",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex min-h-16 w-full max-w-3xl items-center gap-3 px-5 sm:px-8">
        {leading}
        {(title || subtitle) && (
          <div className="min-w-0 flex-1">
            {title && <p className="truncate text-base font-bold text-ink">{title}</p>}
            {subtitle && <p className="truncate text-xs text-ink-soft">{subtitle}</p>}
          </div>
        )}
        {actions && <div className="ml-auto flex items-center gap-1">{actions}</div>}
      </div>
    </header>
  );
}