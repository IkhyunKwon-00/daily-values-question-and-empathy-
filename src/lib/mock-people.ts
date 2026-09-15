import { MOCK_EXPLORE_CARDS } from "@/lib/mock-explore";
import { MOCK_HOME_ANSWERS, TODAY_QUESTION } from "@/lib/mock-home";

export type MockThought = {
  id: string;
  userId: string;
  authorName: string;
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

const ALL_THOUGHTS: MockThought[] = [
  ...MOCK_HOME_ANSWERS.map((answer) => ({
    id: answer.id,
    userId: answer.userId,
    authorName: answer.authorName,
    href: `/answers/${answer.id}`,
    question: TODAY_QUESTION,
    answer: answer.content,
    gender: answer.gender,
    createdAt: answer.createdAt,
    liked: answer.liked,
  })),
  ...MOCK_EXPLORE_CARDS.map((card) => ({
    id: card.id,
    userId: card.userId,
    authorName: card.authorName,
    href: `/feed/${card.id}`,
    question: card.question,
    answer: card.answer,
    gender: card.gender,
    createdAt: card.createdAt,
    liked: card.liked,
  })),
];

const PROFILE_THOUGHT_TEMPLATES = [
  {
    question: "사람을 볼 때 은근히 중요하게 보는 부분은?",
    answer: "별거 아닌 걸 기억해주는 사람이 좋아요. 무심코 했던 말을 기억하고 다시 물어봐 주는 태도에서 마음을 느낍니다.",
    createdAt: "2주 전",
  },
  {
    question: "마음이 복잡한 날에는 어떻게 쉬나요?",
    answer: "휴대폰을 두고 오래 걷습니다. 답을 찾으려 하기보다 익숙한 길을 천천히 걷다 보면 생각이 제자리로 돌아와요.",
    createdAt: "한 달 전",
  },
  {
    question: "오래 지키고 싶은 관계는 어떤 모습인가요?",
    answer: "자주 만나지 못해도 서로의 변화를 궁금해하고, 어려운 이야기를 미루지 않는 관계를 오래 지키고 싶어요.",
    createdAt: "두 달 전",
  },
  {
    question: "요즘 가장 소중하게 여기는 시간은?",
    answer: "하루를 마치고 좋아하는 사람과 별일 없었던 이야기를 나누는 시간이에요. 평범해서 더 오래 지키고 싶습니다.",
    createdAt: "세 달 전",
  },
] as const;

const AUTHORS = [...new Map(ALL_THOUGHTS.map((thought) => [thought.userId, thought])).values()];

const PROFILE_THOUGHTS: MockThought[] = AUTHORS.flatMap((author) =>
  PROFILE_THOUGHT_TEMPLATES.map((thought, index) => {
    const id = `profile-${author.userId}-${index + 1}`;
    return {
      id,
      userId: author.userId,
      authorName: author.authorName,
      href: `/answers/${id}`,
      question: thought.question,
      answer: thought.answer,
      gender: author.gender,
      createdAt: thought.createdAt,
      liked: false,
    };
  }),
);

export function getMockAuthorThoughts(authorId: string) {
  return [...ALL_THOUGHTS, ...PROFILE_THOUGHTS].filter(
    (thought) => thought.userId === authorId,
  );
}

export function getMockThought(answerId: string) {
  return [...ALL_THOUGHTS, ...PROFILE_THOUGHTS].find(
    (thought) => thought.id === answerId,
  );
}

export function getMockAuthor(authorId: string) {
  const thoughts = getMockAuthorThoughts(authorId);
  if (thoughts.length === 0) return null;
  return {
    id: authorId,
    name: thoughts[0].authorName,
    gender: thoughts[0].gender,
    thoughts,
  };
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