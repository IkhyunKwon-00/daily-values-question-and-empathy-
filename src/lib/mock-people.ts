import { MOCK_EXPLORE_CARDS } from "@/lib/mock-explore";
import { MOCK_HOME_ANSWERS, TODAY_QUESTION } from "@/lib/mock-home";

export type MockThought = {
  id: string;
  href: string;
  question: string;
  answer: string;
  gender: "여성" | "남성" | "기타";
  createdAt: string;
  liked: boolean;
};

export type MockComment = {
  id: string;
  gender: "여성" | "남성" | "기타";
  body: string;
  createdAt: string;
};

const AUTHOR_IDS = {
  여성: [
    "10000000-0000-4000-8000-000000000001",
    "10000000-0000-4000-8000-000000000002",
    "10000000-0000-4000-8000-000000000003",
  ],
  남성: [
    "20000000-0000-4000-8000-000000000001",
    "20000000-0000-4000-8000-000000000002",
    "20000000-0000-4000-8000-000000000003",
  ],
  기타: [
    "30000000-0000-4000-8000-000000000001",
    "30000000-0000-4000-8000-000000000002",
  ],
} as const;

const ALL_THOUGHTS: MockThought[] = [
  ...MOCK_HOME_ANSWERS.map((answer) => ({
    id: answer.id,
    href: `/answers/${answer.id}`,
    question: TODAY_QUESTION,
    answer: answer.content,
    gender: answer.gender,
    createdAt: answer.createdAt,
    liked: answer.liked,
  })),
  ...MOCK_EXPLORE_CARDS.map((card) => ({
    id: card.id,
    href: `/feed/${card.id}`,
    question: card.question,
    answer: card.answer,
    gender: card.gender,
    createdAt: card.createdAt,
    liked: card.liked,
  })),
];

export function getMockAuthorId(id: string, gender: MockThought["gender"]) {
  const sameGender = ALL_THOUGHTS.filter((thought) => thought.gender === gender);
  const index = sameGender.findIndex((thought) => thought.id === id);
  const authorIds = AUTHOR_IDS[gender];
  return authorIds[(index < 0 ? 0 : index) % authorIds.length];
}

export function getMockAuthorThoughts(authorId: string) {
  return ALL_THOUGHTS.filter(
    (thought) => getMockAuthorId(thought.id, thought.gender) === authorId,
  );
}

export function getMockAuthor(authorId: string) {
  const thoughts = getMockAuthorThoughts(authorId);
  if (thoughts.length === 0) return null;
  return { id: authorId, gender: thoughts[0].gender, thoughts };
}

export function getMockComments(answerId: string): MockComment[] {
  const variants: MockComment[][] = [
    [
      {
        id: `${answerId}-comment-1`,
        gender: "여성",
        body: "나도 비슷하게 생각해요. 평범한 하루가 괜찮았다고 느껴지는 순간이 오래 남더라고요.",
        createdAt: "조금 전",
      },
      {
        id: `${answerId}-comment-2`,
        gender: "남성",
        body: "나는 오히려 혼자 있을 때 행복을 더 많이 느끼는 것 같아요. 같은 질문에도 다른 장면이 떠오르는 게 흥미롭네요.",
        createdAt: "12분 전",
      },
    ],
    [
      {
        id: `${answerId}-comment-1`,
        gender: "기타",
        body: "이 문장을 읽고 내가 중요하게 생각하는 시간은 무엇인지 잠시 생각해봤어요.",
        createdAt: "8분 전",
      },
    ],
  ];

  return variants[answerId.length % variants.length];
}

export function hasMutualInterest(answerId: string) {
  return answerId.length % 3 === 0;
}