"use client";

import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import IconButton from "@/components/ui/IconButton";

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
};

export default function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
}: BottomSheetProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="바텀 시트 닫기"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full rounded-t-2xl bg-paper-card px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-card"
      >
        <span className="mx-auto block h-1 w-10 rounded-full bg-paper-raise" aria-hidden />
        <header className="mt-4 flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-bold text-ink">{title}</h2>
            {description && (
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{description}</p>
            )}
          </div>
          <IconButton label="닫기" icon={<X />} size="sm" onClick={onClose} />
        </header>
        <div className="mx-auto mt-6 max-w-3xl">{children}</div>
      </section>
    </div>
  );
}