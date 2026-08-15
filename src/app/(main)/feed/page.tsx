import Link from "next/link";
import {
  getTodayQuestion,
  getMyAnswerForQuestion,
  getFeedForQuestion,
} from "@/lib/data";
import { getViewerId, PREVIEW_MODE } from "@/lib/session";
import QuestionCard from "@/components/QuestionCard";
import AnswerCard from "@/components/AnswerCard";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const viewerId = await getViewerId();
  const question = await getTodayQuestion();

  if (!question || !viewerId) {
    return (
      <div className="card p-7 text-center">
        <p className="font-voice text-xl text-ink">아직 볼 수 있는 답변이 없어요</p>
      </div>
    );
  }

  const myAnswer = await getMyAnswerForQuestion(question.id, viewerId);

  // Answer first, then explore — keeps the "생각 먼저" flow intact.
  if (!myAnswer && !PREVIEW_MODE) {
    return (
      <div className="space-y-4">
        <QuestionCard question={question} />
        <div className="card p-7 text-center">
          <p className="text-[15px] leading-relaxed text-ink">
            먼저 오늘의 질문에 답을 남기면
            <br />
            다른 사람들의 생각을 볼 수 있어요.
          </p>
          <Link href="/" className="btn-primary mt-5">
            답변 작성하러 가기
          </Link>
        </div>
      </div>
    );
  }

  const feed = await getFeedForQuestion(question.id, viewerId);

  return (
    <div className="space-y-4">
      <QuestionCard question={question} />

      {feed.length === 0 ? (
        <div className="card p-7 text-center text-sm text-ink-soft">
          아직 다른 답변이 없어요. 오늘 첫 번째 생각을 남겼네요.
        </div>
      ) : (
        <div className="space-y-4">
          {feed.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}
        </div>
      )}
    </div>
  );
}
