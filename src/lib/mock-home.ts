export const TODAY_QUESTION =
  "돈이 많지만 시간이 없는 삶과 돈은 적지만 시간이 많은 삶 중 어느 쪽을 선택하시겠어요?";

export type MockHomeAnswer = {
  id: string;
  gender: "여성" | "남성" | "기타";
  content: string;
  comments: number;
  createdAt: string;
  liked: boolean;
};

export const MOCK_HOME_ANSWERS: MockHomeAnswer[] = [
  {
    id: "time-with-people",
    gender: "여성",
    content:
      "나는 시간이 많은 삶을 선택할 것 같아요.\n\n예전에는 돈이 중요하다고 생각했는데, 일을 하면서 생각이 많이 바뀌었어요. 결국 내가 좋아하는 사람들과 내 시간을 사용할 수 있는 게 더 중요하다는 생각이 들어요.",
    comments: 3,
    createdAt: "8분 전",
    liked: true,
  },
  {
    id: "enough-and-slow",
    gender: "남성",
    content:
      "돈이 아주 적지만 않다면 시간이 많은 쪽을 고르고 싶어요. 아침을 서두르지 않고 시작하고, 저녁에 누군가의 이야기를 끝까지 들을 수 있는 생활이면 충분히 풍요롭다고 느낄 것 같습니다.",
    comments: 5,
    createdAt: "14분 전",
    liked: false,
  },
  {
    id: "season-of-money",
    gender: "여성",
    content:
      "지금의 나는 돈이 많은 삶을 선택할래요. 가족이 아플 때 선택지를 지켜주는 것도 돈이라는 걸 알게 됐거든요. 대신 평생 그렇게 살기보다, 필요한 만큼 모은 뒤 시간을 되찾는 계획을 함께 세우고 싶어요.",
    comments: 8,
    createdAt: "21분 전",
    liked: false,
  },
  {
    id: "ownership-of-time",
    gender: "기타",
    content:
      "시간의 양보다 그 시간을 내가 선택할 수 있는지가 더 중요해요. 바쁜 삶이어도 내가 원해서 몰입하는 시간이라면 괜찮지만, 돈 때문에 계속 원치 않는 방향으로 끌려간다면 오래 버티기 어려울 것 같아요.",
    comments: 2,
    createdAt: "32분 전",
    liked: true,
  },
  {
    id: "small-daily-life",
    gender: "남성",
    content:
      "시간이 많은 쪽이요. 늦은 오후에 산책하고, 평일에 부모님과 밥을 먹고, 친구의 갑작스러운 연락에 나갈 수 있는 삶. 그런 사소한 여유가 결국 내가 기억하는 인생이 될 것 같아요.",
    comments: 4,
    createdAt: "45분 전",
    liked: false,
  },
  {
    id: "freedom-needs-money",
    gender: "여성",
    content:
      "돈이 많은 쪽을 택하겠습니다. 가난했던 시절에는 시간이 있어도 마음이 늘 급했어요. 월세와 병원비 걱정 없이 쉴 수 있는 상태가 먼저 와야 비로소 시간이 내 것이 된다는 걸 배웠습니다.",
    comments: 11,
    createdAt: "1시간 전",
    liked: false,
  },
  {
    id: "ordinary-luxury",
    gender: "남성",
    content:
      "돈은 적어도 시간이 많은 삶. 제게 가장 비싼 것은 좋아하는 사람과 목적 없이 보내는 오후예요. 무엇을 이루지 않아도 괜찮은 시간을 자주 가질 수 있다면 그걸 부유한 삶이라고 부르고 싶습니다.",
    comments: 6,
    createdAt: "1시간 전",
    liked: true,
  },
  {
    id: "balance-is-a-skill",
    gender: "여성",
    content:
      "둘 중 하나를 영원히 고르기보다 시기마다 다르게 선택하고 싶어요. 젊을 때는 집중해서 일하고, 그 보상이 삶 전체를 잠식하기 전에 속도를 줄이는 것. 균형은 상태가 아니라 계속 조정하는 기술 같아요.",
    comments: 7,
    createdAt: "2시간 전",
    liked: false,
  },
  {
    id: "time-for-myself",
    gender: "기타",
    content:
      "시간이 많은 삶을 선택할게요. 돈이 부족해서 포기해야 하는 것도 있겠지만, 내가 무엇을 좋아하고 싫어하는지 생각할 틈조차 없는 삶은 결국 다른 사람의 기준으로 살게 될 것 같거든요.",
    comments: 1,
    createdAt: "2시간 전",
    liked: false,
  },
  {
    id: "responsibility-first",
    gender: "남성",
    content:
      "지금은 책임져야 할 가족이 있어서 돈이 많은 삶을 고를 것 같습니다. 혼자라면 시간이라고 답했겠지만, 내가 바쁜 덕분에 소중한 사람이 조금 더 편안할 수 있다면 그 시간도 의미가 있다고 생각해요.",
    comments: 9,
    createdAt: "3시간 전",
    liked: false,
  },
  {
    id: "memories-not-balance",
    gender: "여성",
    content:
      "통장 잔고보다 오래 남는 건 함께 보낸 시간이었다는 걸 최근에 알았어요. 돈은 다시 벌 수 있지만 어떤 계절의 가족, 친구, 그리고 나 자신은 다시 만날 수 없으니까 시간이 많은 삶을 택하겠습니다.",
    comments: 12,
    createdAt: "4시간 전",
    liked: true,
  },
  {
    id: "quiet-definition",
    gender: "남성",
    content:
      "돈이 적다는 것이 매일의 존엄을 지키기 어려울 정도가 아니라면, 시간이 많은 삶이요. 충분히 자고 천천히 먹고 가까운 사람을 돌볼 수 있는 하루가 제게는 성공의 가장 조용한 정의입니다.",
    comments: 4,
    createdAt: "5시간 전",
    liked: false,
  },
];

export function getMockHomeAnswer(id: string) {
  return MOCK_HOME_ANSWERS.find((answer) => answer.id === id);
}