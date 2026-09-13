import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
  active?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeStyles = {
  sm: "h-8 w-8 [&_svg]:h-4 [&_svg]:w-4",
  md: "h-10 w-10 [&_svg]:h-5 [&_svg]:w-5",
  lg: "h-12 w-12 [&_svg]:h-6 [&_svg]:w-6",
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { className, label, icon, active = false, size = "md", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        aria-pressed={active}
        title={label}
        className={cn(
          "grid shrink-0 place-items-center rounded-lg transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45",
          active
            ? "bg-clay/12 text-clay"
            : "text-ink-soft hover:bg-white/[0.05] hover:text-ink",
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {icon}
      </button>
    );
  },
);

export default IconButton;