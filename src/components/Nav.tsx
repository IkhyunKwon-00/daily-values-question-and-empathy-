"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, MessageCircle, PenLine, Search, UserRound, type LucideIcon } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "홈", Icon: PenLine },
  { href: "/feed", label: "탐색", Icon: Search },
  { href: "/likes", label: "공감", Icon: Heart },
  { href: "/messages", label: "메시지", Icon: MessageCircle },
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
}: {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`group grid h-14 min-w-14 place-items-center rounded-lg px-2 transition lg:h-12 lg:w-full ${
        active
          ? "bg-white/[0.06] text-clay"
          : "text-ink-soft hover:bg-white/[0.04] hover:text-ink"
      }`}
    >
      <Icon className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={active ? 2.2 : 1.8} />
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
      <nav className="mx-auto flex max-w-2xl items-center justify-around px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1 lg:grid lg:grid-cols-1 lg:gap-2 lg:px-5 lg:py-0">
        {NAV_ITEMS.map((t) => (
          <SideTab key={t.href} {...t} active={isActive(pathname, t.href)} />
        ))}
      </nav>
    </aside>
  );
}
