import { notFound } from "next/navigation";
import AnswerDetail from "@/components/home/AnswerDetail";
import { getMockHomeAnswer, MOCK_HOME_ANSWERS } from "@/lib/mock-home";

export function generateStaticParams() {
  return MOCK_HOME_ANSWERS.map((answer) => ({ answerId: answer.id }));
}

export default function AnswerDetailPage({
  params,
}: {
  params: { answerId: string };
}) {
  const answer = getMockHomeAnswer(params.answerId);
  if (!answer) notFound();

  return <AnswerDetail answer={answer} />;
}