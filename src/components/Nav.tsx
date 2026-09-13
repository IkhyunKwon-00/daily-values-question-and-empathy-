"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Compass, Home, PenLine, UserRound, type LucideIcon } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "홈", Icon: Home },
  { href: "/feed", label: "탐색", Icon: Compass },
  { href: "/write", label: "작성", Icon: PenLine, accent: true },
  { href: "/likes", label: "알림", Icon: Bell },
  { href: "/me", label: "프로필", Icon: UserRound },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/answers/");
  return pathname.startsWith(href);
}

function SideTab({
  href,
  label,
  Icon,
  active,
  accent = false,
}: {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`group flex h-14 min-w-14 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[10px] font-medium transition lg:h-12 lg:w-full lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-sm ${
        accent
          ? "text-clay hover:bg-clay/10"
          : active
          ? "bg-white/[0.06] text-clay"
          : "text-ink-soft hover:bg-white/[0.04] hover:text-ink"
      }`}
    >
      <Icon className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={active ? 2.2 : 1.8} />
      <span>{label}</span>
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-paper/95 backdrop-blur-xl lg:inset-y-0 lg:left-0 lg:right-auto lg:w-64 lg:border-r lg:border-t-0">
      <p className="hidden px-8 pb-8 pt-8 text-xs leading-relaxed text-ink-soft lg:block">
        사람을 만나기 전에,<br />그 사람의 생각을 만나는 곳.
      </p>
      <nav className="mx-auto flex max-w-2xl items-center justify-around px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1 lg:block lg:space-y-2 lg:px-5 lg:py-0">
        {NAV_ITEMS.map((t) => (
          <SideTab key={t.href} {...t} active={isActive(pathname, t.href)} />
        ))}
      </nav>
    </aside>
  );
}
