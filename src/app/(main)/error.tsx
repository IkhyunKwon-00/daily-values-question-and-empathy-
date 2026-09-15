"use client";

import Button from "@/components/ui/Button";

export default function MainError({ reset }: { reset: () => void }) {
  return (
    <section className="flex min-h-[60dvh] flex-col items-start justify-center">
      <p className="text-xs font-semibold uppercase text-ink-soft">잠시 멈췄어요</p>
      <h1 className="mt-4 font-voice text-3xl font-bold text-ink">
        오늘의 생각을 불러오지 못했어요.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        연결을 확인한 뒤 다시 시도해 주세요.
      </p>
      <Button className="mt-7" onClick={reset}>다시 불러오기</Button>
    </section>
  );
}