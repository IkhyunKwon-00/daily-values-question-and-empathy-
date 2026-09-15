import AnswerWriting from "@/components/write/AnswerWriting";
import EmptyState from "@/components/ui/EmptyState";
import { getTodayQuestion } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function WritePage() {
  const question = await getTodayQuestion();

  if (!question) {
    return (
      <EmptyState
        title="오늘의 질문을 준비하고 있어요"
        description="잠시 후 다시 확인해 주세요."
      />
    );
  }

  return <AnswerWriting question={question} />;
}