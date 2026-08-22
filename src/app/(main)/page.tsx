import { getTodayQuestion, getMyAnswerForQuestion, getFeedForQuestion } from "@/lib/data";
import { getViewerId } from "@/lib/session";
import QuestionCard from "@/components/QuestionCard";
import AnswerComposer from "@/components/AnswerComposer";
import AnswerCard from "@/components/AnswerCard";
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

  const feed =
    myAnswer && viewerId
      ? await getFeedForQuestion(question.id, viewerId)
      : [];

  return (
    <div className="space-y-4">
      <QuestionCard question={question} />

      {myAnswer ? (
        <>
          <div className="card p-5">
            <p className="meta mb-3 flex items-center gap-2">
              <span className="text-sage">오늘의 내 답변</span>
              <span className="ml-auto">{relativeTime(myAnswer.created_at)}</span>
            </p>
            <p className="whitespace-pre-wrap font-body text-[15px] leading-relaxed text-ink">
              {myAnswer.content}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="h-px flex-1 bg-line" />
            <span className="meta">다른 사람들의 생각</span>
            <span className="h-px flex-1 bg-line" />
          </div>

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
        </>
      ) : (
        <AnswerComposer questionId={question.id} />
      )}
    </div>
  );
}
