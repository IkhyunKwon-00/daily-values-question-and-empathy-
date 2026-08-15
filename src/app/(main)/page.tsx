import Link from "next/link";
import { getTodayQuestion, getMyAnswerForQuestion } from "@/lib/data";
import { getViewerId } from "@/lib/session";
import QuestionCard from "@/components/QuestionCard";
import AnswerComposer from "@/components/AnswerComposer";
import { relativeTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const viewerId = await getViewerId();
  const question = await getTodayQuestion();

  if (!question) {
    return (
      <div className="card p-7 text-center">
        <p className="font-voice text-xl text-ink">오늘의 질문을 준비하고 있어요</p>
        <p className="mt-2 text-sm text-ink-soft">잠시 후 다시 찾아와 주세요.</p>
      </div>
    );
  }

  const myAnswer = viewerId
    ? await getMyAnswerForQuestion(question.id, viewerId)
    : null;

  return (
    <div className="space-y-4">
      <QuestionCard question={question} />

      {myAnswer ? (
        <div className="card p-5">
          <p className="meta mb-3 flex items-center gap-2">
            <span className="text-sage">오늘의 내 답변</span>
            <span className="ml-auto">{relativeTime(myAnswer.created_at)}</span>
          </p>
          <p className="whitespace-pre-wrap font-body text-[15px] leading-relaxed text-ink">
            {myAnswer.content}
          </p>
          <Link href="/feed" className="btn-primary mt-5 w-full">
            다른 사람들의 생각 보러가기
          </Link>
        </div>
      ) : (
        <AnswerComposer questionId={question.id} />
      )}
    </div>
  );
}
