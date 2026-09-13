export type MockExploreCard = {
  id: string;
  gender: "여성" | "남성" | "기타";
  category: "사랑" | "관계" | "행복" | "일" | "돈" | "취향" | "삶";
  question: string;
  answer: string;
  comments: number;
  createdAt: string;
  liked: boolean;
};

export const EXPLORE_CATEGORIES = [
  "전체",
  "사랑",
  "관계",
  "행복",
  "일",
  "돈",
  "취향",
  "삶",
] as const;

export const MOCK_EXPLORE_CARDS: MockExploreCard[] = [
  { id: "happiness-together", gender: "여성", category: "행복", question: "행복은 결국 무엇에서 온다고 생각하나요?", answer: "좋아하는 사람과 별일 없는 하루를 보낸 뒤, 돌아오는 길에 마음이 조용한 상태. 행복은 큰 사건보다 함께 있는 방식에서 오는 것 같아요.", comments: 6, createdAt: "12분 전", liked: true },
  { id: "money-and-enough", gender: "남성", category: "돈", question: "당신에게 충분한 돈은 얼마인가요?", answer: "원하는 것을 다 사는 돈보다, 싫은 일을 거절해도 한동안 괜찮을 만큼의 돈. 제게 충분함은 액수가 아니라 선택할 수 있는 시간에 가까워요.", comments: 4, createdAt: "19분 전", liked: false },
  { id: "quiet-love", gender: "기타", category: "사랑", question: "사랑받고 있다고 느끼는 순간은 언제인가요?", answer: "내가 한 말을 기억해 주는 순간이요. 오래전 무심코 말한 취향이나 걱정을 상대가 기억하고 있을 때, 내 마음이 그 사람 안에 머물 자리가 있다는 느낌이 들어요.", comments: 9, createdAt: "27분 전", liked: false },
  { id: "good-distance", gender: "여성", category: "관계", question: "좋은 관계에는 어느 정도의 거리가 필요할까요?", answer: "서로의 침묵을 불안해하지 않을 정도의 거리. 매일 확인하지 않아도 마음을 의심하지 않고, 필요할 때는 망설이지 않고 다가갈 수 있으면 좋겠어요.", comments: 3, createdAt: "35분 전", liked: true },
  { id: "work-pride", gender: "남성", category: "일", question: "일에서 가장 지키고 싶은 것은 무엇인가요?", answer: "내가 만든 결과를 부끄러워하지 않는 것. 속도가 조금 느려도 누군가의 시간을 함부로 쓰지 않는 일을 하고 싶습니다.", comments: 2, createdAt: "48분 전", liked: false },
  { id: "ordinary-life", gender: "여성", category: "삶", question: "어떤 하루를 오래 기억하고 싶나요?", answer: "아주 평범해서 그때는 특별한 줄 몰랐던 하루요. 가족이 같은 식탁에 있고, 창밖으로 늦은 햇빛이 들어오고, 아무도 서두르지 않던 저녁을 오래 기억하고 싶어요.", comments: 8, createdAt: "1시간 전", liked: false },
  { id: "taste-window", gender: "남성", category: "취향", question: "취향은 사람을 얼마나 보여준다고 생각하나요?", answer: "무엇을 좋아하는지보다 왜 좋아하는지를 들으면 그 사람이 보여요. 같은 노래를 좋아해도 각자 머무는 문장이 다르니까요.", comments: 5, createdAt: "1시간 전", liked: true },
  { id: "brave-choice", gender: "기타", category: "삶", question: "최근 가장 용기 냈던 선택은 무엇인가요?", answer: "오래 다닌 회사를 그만둔 일이요. 대단한 꿈이 있어서가 아니라, 계속 괜찮은 척하면 정말 괜찮지 않은 내가 사라질 것 같아서 멈췄어요.", comments: 12, createdAt: "2시간 전", liked: false },
  { id: "apology", gender: "남성", category: "관계", question: "진심 어린 사과에는 무엇이 필요할까요?", answer: "내 의도가 아니라 상대가 겪은 일을 중심에 놓는 것. 설명하고 싶은 마음을 잠시 내려놓고, 무엇이 아팠는지 끝까지 듣는 것부터 시작한다고 생각합니다.", comments: 7, createdAt: "2시간 전", liked: false },
  { id: "spending-value", gender: "여성", category: "돈", question: "아깝지 않게 쓰는 돈이 있나요?", answer: "경험을 넓혀 주는 이동과 책에는 덜 망설여요. 물건은 익숙해지지만 새롭게 알게 된 세계는 오래 남아서 다음 선택까지 바꿔 주더라고요.", comments: 1, createdAt: "3시간 전", liked: true },
  { id: "being-myself", gender: "여성", category: "행복", question: "가장 나답다고 느끼는 순간은 언제인가요?", answer: "누구에게 잘 보이려는 마음 없이 농담할 때요. 말하고 나서 표정을 살피지 않아도 되는 사람 곁에서 가장 나다운 목소리가 나오는 것 같아요.", comments: 6, createdAt: "3시간 전", liked: false },
  { id: "lasting-love", gender: "남성", category: "사랑", question: "사랑을 오래가게 하는 것은 무엇일까요?", answer: "익숙함 속에서도 계속 궁금해하는 태도라고 생각해요. 이미 안다고 단정하지 않고 오늘의 마음을 다시 묻는 것.", comments: 10, createdAt: "4시간 전", liked: false },
  { id: "rest-without-guilt", gender: "기타", category: "일", question: "잘 쉰다는 건 어떤 의미인가요?", answer: "쉬는 동안 생산성을 회복하려 하지 않는 것. 아무 쓸모 없는 시간을 보냈다는 죄책감 없이 하루를 닫을 수 있다면 잘 쉰 것 같아요.", comments: 4, createdAt: "5시간 전", liked: true },
  { id: "favorite-season", gender: "여성", category: "취향", question: "가장 좋아하는 계절과 그 이유는?", answer: "초가을을 좋아해요. 아직 여름의 빛이 남아 있는데 바람만 먼저 달라지는 시기라서, 무언가 끝나도 다음 것이 조용히 오고 있다는 느낌이 듭니다.", comments: 3, createdAt: "6시간 전", liked: false },
  { id: "adult-definition", gender: "남성", category: "삶", question: "좋은 어른은 어떤 사람일까요?", answer: "틀렸다는 걸 알았을 때 체면보다 수정을 먼저 선택하는 사람. 자신의 경험을 정답처럼 내밀지 않고 다음 세대의 다른 답을 들어주는 사람이고 싶어요.", comments: 11, createdAt: "어제", liked: false },
  { id: "trust-signal", gender: "여성", category: "관계", question: "누군가를 신뢰하게 되는 작은 신호가 있나요?", answer: "사람에 따라 태도가 크게 달라지지 않는 모습을 볼 때요. 자신에게 필요한 사람뿐 아니라 지나가는 사람에게도 같은 예의를 지키는 사람을 믿게 돼요.", comments: 5, createdAt: "어제", liked: true },
];

export function getMockExploreCard(id: string) {
  return MOCK_EXPLORE_CARDS.find((card) => card.id === id);
}