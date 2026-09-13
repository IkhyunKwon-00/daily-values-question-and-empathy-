import type { HTMLAttributes, ReactNode } from "react";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";

export type ProfileHeaderProps = HTMLAttributes<HTMLElement> & {
  title: string;
  description?: string;
  avatarLabel?: string;
  meta?: ReactNode;
  action?: ReactNode;
};

export default function ProfileHeader({
  className,
  title,
  description,
  avatarLabel = title,
  meta,
  action,
  ...props
}: ProfileHeaderProps) {
  return (
    <section className={cn("flex items-start gap-4 py-2", className)} {...props}>
      <Avatar label={avatarLabel} size="lg" />
      <div className="min-w-0 flex-1 pt-1">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{description}</p>
        )}
        {meta && <div className="mt-2 text-xs text-ink-soft">{meta}</div>}
      </div>
      {action}
    </section>
  );
}