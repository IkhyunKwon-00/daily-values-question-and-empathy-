"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "오늘" },
  { href: "/feed", label: "탐색" },
  { href: "/me", label: "내 기록" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 border-t border-line bg-paper-card/90 backdrop-blur md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="mx-auto flex max-w-xl items-center justify-around px-4 py-2 md:justify-start md:gap-8">
        <span className="hidden font-voice text-lg text-ink md:mr-auto md:block">
          오늘의 가치관
        </span>
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-ink text-paper-card"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
