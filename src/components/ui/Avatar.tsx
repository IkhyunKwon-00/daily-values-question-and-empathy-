import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  label: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
};

const sizeStyles = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-sm",
};

export default function Avatar({
  className,
  label,
  size = "md",
  online = false,
  ...props
}: AvatarProps) {
  const initial = label.trim().slice(0, 1) || "?";

  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "relative inline-grid shrink-0 place-items-center rounded-full bg-paper-raise font-semibold text-ink-soft",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {initial}
      {online && (
        <span
          className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-paper-card bg-sage"
          aria-label="온라인"
        />
      )}
    </span>
  );
}