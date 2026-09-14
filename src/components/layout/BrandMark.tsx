import Link from "next/link";

export default function BrandMark({ linked = true }: { linked?: boolean }) {
  const mark = (
    <span className="inline-flex items-baseline gap-2" aria-label="weve">
      <span className="font-logo text-[2rem] font-semibold leading-none text-ink">
        weve
      </span>
      <span className="h-2 w-2 rounded-full bg-clay" aria-hidden />
    </span>
  );

  return linked ? <Link href="/">{mark}</Link> : mark;
}