"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Search } from "lucide-react";
import BrandMark from "@/components/layout/BrandMark";

export default function AppHeader() {
  const pathname = usePathname();

  if (
    pathname === "/write" ||
    pathname === "/settings" ||
    pathname.startsWith("/answers/") ||
    /^\/feed\/.+/.test(pathname) ||
    pathname.startsWith("/people/")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-2xl items-center px-5 sm:px-8">
        <BrandMark />
        {pathname !== "/" && <div className="ml-auto flex items-center gap-1">
          <Link
            href="/feed"
            aria-label="탐색"
            title="탐색"
            className="grid h-11 w-11 place-items-center rounded-lg text-ink-soft transition hover:bg-white/[0.05] hover:text-ink"
          >
            <Search className="h-5 w-5" strokeWidth={1.8} />
          </Link>
          <Link
            href="/likes"
            aria-label="공감"
            title="공감"
            className="relative grid h-11 w-11 place-items-center rounded-lg text-ink-soft transition hover:bg-white/[0.05] hover:text-ink"
          >
            <Heart className="h-5 w-5" strokeWidth={1.8} />
            <span
              className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-clay"
              aria-hidden
            />
          </Link>
        </div>}
      </div>
    </header>
  );
}