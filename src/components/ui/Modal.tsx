"use client";

import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import IconButton from "@/components/ui/IconButton";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
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
    <div className="fixed inset-0 z-50 grid place-items-center p-5" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="모달 닫기"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-lg bg-paper-card p-6 shadow-card"
      >
        <header className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-xl font-bold text-ink">{title}</h2>
            {description && (
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{description}</p>
            )}
          </div>
          <IconButton label="닫기" icon={<X />} size="sm" onClick={onClose} />
        </header>
        <div className="mt-6 text-sm leading-relaxed text-ink">{children}</div>
        {footer && <footer className="mt-6 flex justify-end gap-2">{footer}</footer>}
      </section>
    </div>
  );
}