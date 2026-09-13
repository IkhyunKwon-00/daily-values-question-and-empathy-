import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BottomNavigationItem = {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
};

export type BottomNavigationProps = HTMLAttributes<HTMLElement> & {
  items: BottomNavigationItem[];
  position?: "fixed" | "static";
};

export default function BottomNavigation({
  className,
  items,
  position = "fixed",
  ...props
}: BottomNavigationProps) {
  return (
    <nav
      aria-label="주요 메뉴"
      className={cn(
        "z-30 bg-paper/95 backdrop-blur-xl",
        position === "fixed" && "fixed inset-x-0 bottom-0",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex min-h-16 max-w-3xl items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "flex min-w-14 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[10px] font-medium transition",
              "[&_svg]:h-5 [&_svg]:w-5",
              item.active ? "text-clay" : "text-ink-soft hover:text-ink",
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}