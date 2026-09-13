"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

type ToastTone = "success" | "info" | "error";

export type ToastProps = {
  open: boolean;
  message: string;
  tone?: ToastTone;
  duration?: number;
  onClose: () => void;
  className?: string;
};

const icons = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
};

const toneStyles: Record<ToastTone, string> = {
  success: "text-sage",
  info: "text-clay",
  error: "text-rose",
};

export default function Toast({
  open,
  message,
  tone = "info",
  duration = 4000,
  onClose,
  className,
}: ToastProps) {
  const Icon = icons[tone];

  useEffect(() => {
    if (!open || duration <= 0) return;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onClose, open]);

  if (!open) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed inset-x-5 bottom-24 z-[60] mx-auto flex max-w-sm items-center gap-3 rounded-lg bg-ink px-4 py-3 text-paper shadow-card animate-fade-up",
        className,
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", toneStyles[tone])} aria-hidden />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <IconButton
        label="알림 닫기"
        icon={<X />}
        size="sm"
        onClick={onClose}
        className="text-paper/60 hover:bg-black/10 hover:text-paper"
      />
    </div>
  );
}