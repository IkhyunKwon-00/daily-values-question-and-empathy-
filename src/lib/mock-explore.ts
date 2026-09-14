import sampleData from "@/data/sample-data.json";

type MockGender = "여성" | "남성" | "기타";

export type MockExploreCard = {
  id: string;
  userId: string;
  authorName: string;
  gender: MockGender;
  question: string;
  answer: string;
  comments: number;
  createdAt: string;
  liked: boolean;
};

const createdAt = [
  "12분 전", "19분 전", "27분 전", "35분 전", "48분 전", "1시간 전",
  "1시간 전", "2시간 전", "2시간 전", "3시간 전", "3시간 전", "4시간 전",
  "5시간 전", "6시간 전", "어제", "어제", "2일 전", "2일 전",
];

export const MOCK_EXPLORE_CARDS: MockExploreCard[] = sampleData.exploreAnswers.map(
  (answer, index) => {
    const question = sampleData.questions[index + 1];
    const user = sampleData.users[index + 12];
    return {
      id: `explore-${question.id}`,
      userId: user.id,
      authorName: user.name,
      gender: user.gender as MockGender,
      question: question.text,
      answer,
      comments: (index * 5 + 1) % 13,
      createdAt: createdAt[index],
      liked: index % 5 === 0,
    };
  },
);

export function getMockExploreCard(id: string) {
  return MOCK_EXPLORE_CARDS.find((card) => card.id === id);
}