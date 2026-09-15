import { notFound } from "next/navigation";
import AnswerDetail from "@/components/home/AnswerDetail";
import { getMockHomeAnswer, MOCK_HOME_ANSWERS } from "@/lib/mock-home";
import {
  getMockAuthorThoughts,
  getMockComments,
  getMockThought,
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
  const homeAnswer = getMockHomeAnswer(params.answerId);
  const thought = homeAnswer ? null : getMockThought(params.answerId);
  if (!homeAnswer && !thought) notFound();

  const answer = homeAnswer ?? {
    id: thought!.id,
    userId: thought!.userId,
    authorName: thought!.authorName,
    gender: thought!.gender,
    content: thought!.answer,
    comments: 0,
    createdAt: thought!.createdAt,
    liked: thought!.liked,
  };
  const authorId = answer.userId;
  const otherThoughts = getMockAuthorThoughts(authorId).filter(
    (thought) => thought.id !== answer.id,
  );

  return (
    <AnswerDetail
      answer={answer}
      question={thought?.question}
      authorId={authorId}
      otherThoughts={otherThoughts}
      initialComments={getMockComments(answer.id)}
      mutualInterest={hasMutualInterest(answer.id)}
    />
  );
}