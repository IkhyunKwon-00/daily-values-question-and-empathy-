"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconProps = { active: boolean };

function CompassIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M15.5 8.5 13.3 13.3 8.5 15.5 10.7 10.7 15.5 8.5Z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
      <path
        d="M12 20s-7-4.35-9.2-8.4C1.4 9.1 2.5 6 5.6 6c1.9 0 3.1 1.2 3.9 2.3.8-1.1 2-2.3 3.9-2.3 3.1 0 4.2 3.1 2.8 5.6C19 15.65 12 20 12 20Z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
      <path
        d="M4 5h16v11H8l-4 3V5Z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="8.5"
        r="3.5"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 19.5c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const SIDE_TABS_LEFT = [
  { href: "/feed", label: "탐색", Icon: CompassIcon },
  { href: "/likes", label: "관심", Icon: HeartIcon },
];
const SIDE_TABS_RIGHT = [
  { href: "/messages", label: "쪽지", Icon: MessageIcon },
  { href: "/me", label: "기록", Icon: UserIcon },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function SideTab({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: (p: IconProps) => JSX.Element;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex w-14 flex-col items-center gap-0.5 py-1 text-[11px] transition-colors ${
        active ? "text-ink" : "text-ink-soft hover:text-ink"
      }`}
    >
      <Icon active={active} />
      <span>{label}</span>
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const todayActive = pathname === "/";

  return (
    <nav className="sticky bottom-0 z-20 border-t border-line bg-paper-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-end justify-around px-3 pb-2 pt-1.5">
        {SIDE_TABS_LEFT.map((t) => (
          <SideTab key={t.href} {...t} active={isActive(pathname, t.href)} />
        ))}

        <Link
          href="/"
          aria-label="오늘의 질문 작성"
          className="flex w-14 flex-col items-center"
        >
          <span
            className={`-mt-6 grid h-14 w-14 place-items-center rounded-full bg-ember text-white shadow-pop transition active:scale-95 ${
              todayActive ? "ring-4 ring-clay/20" : ""
            }`}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
              <path
                d="M4 20 5 15.5 15.5 5l3.5 3.5L8.5 19 4 20Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M13.5 7 17 10.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
          <span
            className={`-mt-4 text-[11px] ${
              todayActive ? "text-ink" : "text-ink-soft"
            }`}
          >
            오늘
          </span>
        </Link>

        {SIDE_TABS_RIGHT.map((t) => (
          <SideTab key={t.href} {...t} active={isActive(pathname, t.href)} />
        ))}
      </div>
    </nav>
  );
}
