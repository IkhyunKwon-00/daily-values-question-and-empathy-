import { notFound } from "next/navigation";
import PublishedAnswerDetail from "@/components/explore/PublishedAnswerDetail";
import DetailUnavailable from "@/components/detail/DetailUnavailable";
import AnswerDetail from "@/components/home/AnswerDetail";
import { getMockExploreCard, MOCK_EXPLORE_CARDS } from "@/lib/mock-explore";
import {
  getMockAuthorThoughts,
  getMockComments,
  hasMutualInterest,
} from "@/lib/mock-people";

export function generateStaticParams() {
  return [
    ...MOCK_EXPLORE_CARDS.map((card) => ({ answerId: card.id })),
    { answerId: "my-latest-answer" },
    { answerId: "deleted" },
    { answerId: "blocked" },
    { answerId: "error" },
  ];
}

export default function ExploreAnswerPage({
  params,
}: {
  params: { answerId: string };
}) {
  if (params.answerId === "my-latest-answer") {
    return <PublishedAnswerDetail />;
  }
  if (params.answerId === "deleted") return <DetailUnavailable state="deleted" />;
  if (params.answerId === "blocked") return <DetailUnavailable state="blocked" />;
  if (params.answerId === "error") return <DetailUnavailable state="error" />;

  const card = getMockExploreCard(params.answerId);
  if (!card) notFound();
  const authorId = card.userId;
  const otherThoughts = getMockAuthorThoughts(authorId).filter(
    (thought) => thought.id !== card.id,
  );

  return (
    <AnswerDetail
      question={card.question}
      backHref="/feed"
      backLabel="탐색으로"
      authorId={authorId}
      otherThoughts={otherThoughts}
      initialComments={getMockComments(card.id)}
      mutualInterest={hasMutualInterest(card.id)}
      answer={{
        id: card.id,
        userId: card.userId,
        authorName: card.authorName,
        gender: card.gender,
        content: card.answer,
        comments: card.comments,
        createdAt: card.createdAt,
        liked: card.liked,
      }}
    />
  );
}