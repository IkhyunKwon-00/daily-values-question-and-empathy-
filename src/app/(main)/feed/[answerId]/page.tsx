import { notFound } from "next/navigation";
import PublishedAnswerDetail from "@/components/explore/PublishedAnswerDetail";
import AnswerDetail from "@/components/home/AnswerDetail";
import { getMockExploreCard, MOCK_EXPLORE_CARDS } from "@/lib/mock-explore";

export function generateStaticParams() {
  return [
    ...MOCK_EXPLORE_CARDS.map((card) => ({ answerId: card.id })),
    { answerId: "my-latest-answer" },
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

  const card = getMockExploreCard(params.answerId);
  if (!card) notFound();

  return (
    <AnswerDetail
      question={card.question}
      backHref="/feed"
      backLabel="탐색으로"
      answer={{
        id: card.id,
        gender: card.gender,
        content: card.answer,
        comments: card.comments,
        createdAt: card.createdAt,
        liked: card.liked,
      }}
    />
  );
}