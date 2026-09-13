import { notFound } from "next/navigation";
import AnswerDetail from "@/components/home/AnswerDetail";
import { getMockHomeAnswer, MOCK_HOME_ANSWERS } from "@/lib/mock-home";
import {
  getMockAuthorId,
  getMockAuthorThoughts,
  getMockComments,
  hasMutualInterest,
} from "@/lib/mock-people";

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
  const authorId = getMockAuthorId(answer.id, answer.gender);
  const otherThoughts = getMockAuthorThoughts(authorId).filter(
    (thought) => thought.id !== answer.id,
  );

  return (
    <AnswerDetail
      answer={answer}
      authorId={authorId}
      otherThoughts={otherThoughts}
      initialComments={getMockComments(answer.id)}
      mutualInterest={hasMutualInterest(answer.id)}
    />
  );
}