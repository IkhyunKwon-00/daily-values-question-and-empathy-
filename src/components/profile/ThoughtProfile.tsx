"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { MockThought } from "@/lib/mock-people";

export default function ThoughtProfile({
  name,
  gender,
  thoughts,
}: {
  authorId: string;
  name: string;
  gender: MockThought["gender"];
  thoughts: MockThought[];
}) {
  return (
    <div className="mx-auto max-w-[42rem]">
      <header className="sticky top-0 z-20 -mx-5 flex h-14 items-center bg-paper/90 px-4 backdrop-blur-xl sm:-mx-8 sm:px-7">
        <button type="button" onClick={() => history.back()} aria-label="뒤로 가기" className="grid h-11 w-11 place-items-center rounded-lg text-ink-soft hover:bg-white/[0.05] hover:text-ink">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="ml-2 text-sm font-semibold text-ink">프로필</span>
      </header>

      <section className="border-b border-line/60 py-10 sm:py-14">
        <p className="text-xs font-semibold uppercase text-ink-soft">Thought profile</p>
        <h1 className="mt-4 text-3xl font-bold text-ink">{name}</h1>
        <p className="mt-2 text-sm font-semibold text-ink-soft">{gender}</p>
        <p className="mt-5 max-w-lg font-body text-base leading-[1.8] text-ink-soft">
          지금까지 남긴 문장을 따라 천천히 알아가는 사람입니다.
        </p>
      </section>

      <section id="thoughts" className="pt-10 sm:pt-14">
        <h2 className="text-2xl font-bold text-ink">이 사람이 남긴 생각</h2>
        <div className="mt-6 divide-y divide-line/60 border-y border-line/60">
          {thoughts.map((thought) => (
            <article key={`${thought.href}-${thought.id}`} className="py-9 sm:py-11">
              <Link href={thought.href} className="group block">
                <time className="text-xs text-ink-soft">{thought.createdAt}</time>
                <h3 className="mt-3 break-words font-voice text-xl font-bold leading-[1.55] text-ink transition-colors group-hover:text-clay sm:text-2xl">
                  {thought.question}
                </h3>
                <p className="mt-4 line-clamp-4 break-words font-body text-lg leading-[1.85] text-ink sm:text-xl">
                  {thought.answer}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}