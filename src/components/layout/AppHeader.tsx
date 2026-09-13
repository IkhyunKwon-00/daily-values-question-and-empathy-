"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import BrandMark from "@/components/layout/BrandMark";

export default function AppHeader() {
  const pathname = usePathname();

  if (pathname === "/write") return null;

  return (
    <header className="sticky top-0 z-20 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-2xl items-center px-5 sm:px-8">
        <BrandMark />
        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/feed"
            aria-label="생각 검색"
            title="검색"
            className="grid h-10 w-10 place-items-center rounded-lg text-ink-soft transition hover:bg-white/[0.05] hover:text-ink"
          >
            <Search className="h-5 w-5" strokeWidth={1.8} />
          </Link>
          <Link
            href="/likes"
            aria-label="알림"
            title="알림"
            className="relative grid h-10 w-10 place-items-center rounded-lg text-ink-soft transition hover:bg-white/[0.05] hover:text-ink"
          >
            <Bell className="h-5 w-5" strokeWidth={1.8} />
            <span
              className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-clay"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </header>
  );
}