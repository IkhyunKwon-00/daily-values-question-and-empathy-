import sampleData from "@/data/sample-data.json";

type MockGender = "여성" | "남성" | "기타";

export const TODAY_QUESTION = sampleData.questions[0].text;

export type MockHomeAnswer = {
  id: string;
  userId: string;
  authorName: string;
  gender: MockGender;
  content: string;
  comments: number;
  createdAt: string;
  liked: boolean;
};

const createdAt = [
  "8분 전", "14분 전", "21분 전", "32분 전", "45분 전", "1시간 전",
  "1시간 전", "2시간 전", "2시간 전", "3시간 전", "4시간 전", "5시간 전",
];

export const MOCK_HOME_ANSWERS: MockHomeAnswer[] = sampleData.homeAnswers.map(
  (content, index) => {
    const user = sampleData.users[index];
    return {
      id: `home-${sampleData.questions[0].id}-${index + 1}`,
      userId: user.id,
      authorName: user.name,
      gender: user.gender as MockGender,
      content,
      comments: (index * 3) % 13,
      createdAt: createdAt[index],
      liked: index % 4 === 0,
    };
  },
);

export function getMockHomeAnswer(id: string) {
  return MOCK_HOME_ANSWERS.find((answer) => answer.id === id);
}