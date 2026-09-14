"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import LikeButton from "@/components/ui/LikeButton";
import type { MockThought } from "@/lib/mock-people";

export default function ThoughtProfile({
  authorId,
  name,
  gender,
  thoughts,
}: {
  authorId: string;
  name: string;
  gender: MockThought["gender"];
  thoughts: MockThought[];
}) {
  const [likedIds, setLikedIds] = useState(
    () => new Set(thoughts.filter((thought) => thought.liked).map((thought) => thought.id)),
  );

  return (
    <div className="mx-auto max-w-[42rem]">
      <header className="sticky top-0 z-20 -mx-5 flex h-14 items-center bg-paper/90 px-4 backdrop-blur-xl sm:-mx-8 sm:px-7">
        <button type="button" onClick={() => history.back()} aria-label="뒤로 가기" className="grid h-10 w-10 place-items-center rounded-lg text-ink-soft hover:bg-white/[0.05] hover:text-ink">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="ml-2 text-sm font-semibold text-ink">프로필</span>
      </header>

      <section className="py-10">
        <Avatar label={name} size="lg" />
        <h1 className="mt-5 text-2xl font-bold text-ink">{name}</h1>
        <p className="mt-1 text-sm text-ink-soft">{gender}</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          얼굴이나 숫자보다, 지금까지 남긴 문장으로 천천히 알아가는 사람입니다.
        </p>
        <Button className="mt-6" variant="secondary" onClick={() => document.getElementById("thoughts")?.scrollIntoView({ behavior: "smooth" })}>
          생각 읽어보기
        </Button>
      </section>

      <section id="thoughts" className="border-t border-line/60 pt-9">
        <p className="text-xs font-semibold uppercase text-clay">Thought archive</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">이 사람이 남긴 생각</h2>
        <div className="mt-6 space-y-4">
          {thoughts.map((thought) => (
            <article key={`${thought.href}-${thought.id}`} className="rounded-lg bg-paper-card p-5 sm:p-6">
              <Link href={thought.href}>
                <h3 className="font-voice text-xl font-bold leading-[1.55] text-ink">{thought.question}</h3>
                <p className="mt-4 line-clamp-4 font-body text-[15px] leading-[1.85] text-ink-soft">{thought.answer}</p>
              </Link>
              <div className="mt-4 flex items-center">
                <LikeButton
                  liked={likedIds.has(thought.id)}
                  size="sm"
                  onClick={() => setLikedIds((current) => {
                    const next = new Set(current);
                    if (next.has(thought.id)) next.delete(thought.id);
                    else next.add(thought.id);
                    return next;
                  })}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-lg bg-paper-card p-6 text-center">
        <MessageCircle className="mx-auto h-5 w-5 text-clay" />
        <h2 className="mt-4 text-lg font-bold text-ink">문장에서 시작한 대화</h2>
        <p className="mt-2 text-sm text-ink-soft">서로의 생각에 관심이 생기면 대화를 이어갈 수 있어요.</p>
        <Link href={`/messages/${authorId}`} className="btn-primary mt-5">대화 시작하기</Link>
      </section>
    </div>
  );
}