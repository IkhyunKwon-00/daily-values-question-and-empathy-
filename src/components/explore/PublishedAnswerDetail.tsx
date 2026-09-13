"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AnswerDetail from "@/components/home/AnswerDetail";
import LoadingState from "@/components/ui/LoadingState";
import { PUBLISHED_ANSWER_KEY, type PublishedMockAnswer } from "@/lib/mock-storage";

export default function PublishedAnswerDetail() {
  const [answer, setAnswer] = useState<PublishedMockAnswer | null | undefined>();

  useEffect(() => {
    const stored = window.localStorage.getItem(PUBLISHED_ANSWER_KEY);
    setAnswer(stored ? (JSON.parse(stored) as PublishedMockAnswer) : null);
  }, []);

  if (answer === undefined) return <LoadingState items={1} />;

  if (!answer) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-bold text-ink">게시한 답변을 찾을 수 없어요</p>
        <Link href="/write" className="btn-primary mt-5">새 답변 쓰기</Link>
      </div>
    );
  }

  return (
    <AnswerDetail
      question={answer.question}
      backHref="/feed"
      backLabel="탐색으로"
      answer={{
        id: "my-latest-answer",
        gender: "기타",
        content: answer.answer,
        comments: 0,
        createdAt: "방금 전",
        liked: false,
      }}
    />
  );
}