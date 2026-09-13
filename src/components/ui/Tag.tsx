import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TagTone = "accent" | "neutral" | "warm";

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: TagTone;
};

const toneStyles: Record<TagTone, string> = {
  accent: "bg-clay/12 text-clay",
  neutral: "bg-white/[0.06] text-ink-soft",
  warm: "bg-rose/10 text-rose",
};

export default function Tag({
  className,
  tone = "neutral",
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-full px-2.5 text-[11px] font-semibold leading-none",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}