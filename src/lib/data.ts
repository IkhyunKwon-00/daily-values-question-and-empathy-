import "server-only";
import { createClient } from "@/lib/supabase/server";
import { todayKey } from "@/lib/format";
import { PREVIEW_MODE } from "@/lib/session";
import { nicknameFor } from "@/lib/category";
import type {
  Conversation,
  ExploreCard,
  FeedAnswer,
  Gender,
  LikedAuthor,
  Message,
  Question,
} from "@/lib/types";

type ProfileJoin = { gender: Gender | null } | { gender: Gender | null }[] | null;

function pickGender(p: ProfileJoin): Gender | null {
  if (!p) return null;
  return Array.isArray(p) ? (p[0]?.gender ?? null) : p.gender;
}

// ---- Preview mock data (used only when PREVIEW_MODE is on) ------------------
const DEMO_QUESTION: Question = {
  id: "demo-question",
  text: "사랑이란 뭔가요?",
  category: "사랑",
  publish_date: todayKey(),
};

const DEMO_FEED: FeedAnswer[] = [
  {
    id: "demo-a1",
    user_id: "demo-u1",
    question_id: DEMO_QUESTION.id,
    content:
      "사랑은 상대가 나와 다르다는 걸 알면서도, 그 다름을 굳이 고치려 하지 않고 곁에 두는 일 같아요. 편해서 머무는 게 아니라, 불편함까지 껴안기로 선택하는 마음이요.",
    created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    author_gender: "female",
    liked_by_me: false,
    is_mine: false,
  },
  {
    id: "demo-a2",
    user_id: "demo-u2",
    question_id: DEMO_QUESTION.id,
    content:
      "예전엔 사랑이 뜨거운 감정이라고 생각했는데, 요즘은 아침에 잘 잤냐고 묻는 사소한 문장 안에 더 오래 남아 있는 것 같아요. 결국 사랑은 꾸준함의 다른 이름이 아닐까요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    author_gender: "male",
    liked_by_me: true,
    is_mine: false,
  },
];

export async function getTodayQuestion(): Promise<Question | null> {
  if (PREVIEW_MODE) return DEMO_QUESTION;
  const supabase = createClient();
  const { data } = await supabase
    .from("questions")
    .select("id, text, category, publish_date")
    .eq("publish_date", todayKey())
    .maybeSingle();
  return data ?? null;
}

export async function getMyAnswerForQuestion(questionId: string, userId: string) {
  if (PREVIEW_MODE) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("answers")
    .select("id, user_id, question_id, content, created_at")
    .eq("question_id", questionId)
    .eq("user_id", userId)
    .maybeSingle();
  return data ?? null;
}

async function blockedUserIds(viewerId: string): Promise<string[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("blocks")
    .select("blocked_id")
    .eq("blocker_id", viewerId);
  return (data ?? []).map((b) => b.blocked_id);
}

async function likedAnswerIds(
  viewerId: string,
  answerIds: string[]
): Promise<Set<string>> {
  if (answerIds.length === 0) return new Set();
  const supabase = createClient();
  const { data } = await supabase
    .from("likes")
    .select("answer_id")
    .eq("from_user_id", viewerId)
    .in("answer_id", answerIds);
  return new Set((data ?? []).map((l) => l.answer_id));
}

/** Explore feed: other users' answers to the given question (newest first). */
export async function getFeedForQuestion(
  questionId: string,
  viewerId: string
): Promise<FeedAnswer[]> {
  if (PREVIEW_MODE) return DEMO_FEED;
  const supabase = createClient();
  const blocked = await blockedUserIds(viewerId);

  let query = supabase
    .from("answers")
    .select("id, user_id, question_id, content, created_at, profiles ( gender )")
    .eq("question_id", questionId)
    .neq("user_id", viewerId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (blocked.length > 0) {
    query = query.not("user_id", "in", `(${blocked.join(",")})`);
  }

  const { data } = await query;
  const rows = data ?? [];
  const liked = await likedAnswerIds(
    viewerId,
    rows.map((r) => r.id)
  );

  return rows.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    question_id: r.question_id,
    content: r.content,
    created_at: r.created_at,
    author_gender: pickGender(r.profiles as ProfileJoin),
    liked_by_me: liked.has(r.id),
    is_mine: false,
  }));
}

export type MyAnswer = {
  id: string;
  content: string;
  created_at: string;
  question_text: string;
  question_category: string;
  has_empathy: boolean;
};

/** Personal feed: my own answers with question text and whether any empathy arrived. */
export async function getMyAnswers(userId: string): Promise<MyAnswer[]> {
  if (PREVIEW_MODE) {
    return [
      {
        id: "demo-mine-1",
        content:
          "사랑은 상대를 내 방식대로 바꾸려는 마음을 내려놓는 연습이라고 생각해요. 그 사람이 가진 결을 있는 그대로 바라볼 수 있을 때, 비로소 사랑이 시작되는 것 같아요.",
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        question_text: DEMO_QUESTION.text,
        question_category: DEMO_QUESTION.category,
        has_empathy: true,
      },
    ];
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("answers")
    .select(
      "id, content, created_at, questions ( text, category )"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = data ?? [];

  // "Empathy arrived" is a boolean only — total counts are intentionally private.
  const { data: receivedLikes } = await supabase
    .from("likes")
    .select("answer_id")
    .eq("to_user_id", userId);
  const empathized = new Set((receivedLikes ?? []).map((l) => l.answer_id));

  return rows.map((r) => {
    const q = r.questions as
      | { text: string; category: string }
      | { text: string; category: string }[]
      | null;
    const question = Array.isArray(q) ? q[0] : q;
    return {
      id: r.id,
      content: r.content,
      created_at: r.created_at,
      question_text: question?.text ?? "질문",
      question_category: question?.category ?? "",
      has_empathy: empathized.has(r.id),
    };
  });
}

// ---- Explore feed ----------------------------------------------------------

type QuestionJoin =
  | { text: string; category: string }
  | { text: string; category: string }[]
  | null;

function pickQuestion(q: QuestionJoin): { text: string; category: string } | null {
  if (!q) return null;
  return Array.isArray(q) ? q[0] ?? null : q;
}

const DEMO_EXPLORE: ExploreCard[] = [
  {
    id: "demo-e1",
    user_id: "demo-u3",
    content: "낯선 골목을 목적 없이 걷는 게 좋아요.",
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    question_text: "어떤 여행 스타일을 좋아하나요?",
    question_category: "취미",
    author_gender: "male",
    author_name: "느린산책",
    liked_by_me: false,
  },
  {
    id: "demo-e2",
    user_id: "demo-u1",
    content:
      "돈은 선택지를 넓혀주는 도구라고 생각해요. 목적이 되면 불행해지지만, 좋아하는 사람들과 시간을 지키는 수단일 때 가장 값져요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    question_text: "삶에 있어서 돈은 얼마나 중요한가요?",
    question_category: "가치관",
    author_gender: "female",
    author_name: "달빛문장",
    liked_by_me: true,
  },
  {
    id: "demo-e3",
    user_id: "demo-u2",
    content:
      "꿈은 거창한 목표라기보다, 매일 아침 눈뜨는 이유 같은 거예요. 저는 사람들의 이야기를 오래 듣고 기록하는 사람이 되고 싶어요. 누군가의 하루를 문장으로 남겨두는 일이 오래도록 하고 싶은 일이에요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    question_text: "꿈이 뭔가요?",
    question_category: "꿈",
    author_gender: "male",
    author_name: "종이비행기",
    liked_by_me: false,
  },
  {
    id: "demo-e4",
    user_id: "demo-u4",
    content: "좋아하는 사람이 나 때문에 웃을 때요.",
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    question_text: "언제 가장 행복한가요?",
    question_category: "가치관",
    author_gender: "female",
    author_name: "민들레",
    liked_by_me: false,
  },
  {
    id: "demo-e5",
    user_id: "demo-u5",
    content:
      "저는 아침형 인간이에요. 해가 뜨기 전의 조용한 공기를 좋아해서, 남들보다 한두 시간 먼저 하루를 시작하면 그날 하루가 온전히 내 것 같은 기분이 들어요. 그 시간에 커피를 내리고 창밖을 보는 게 유일한 사치예요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    question_text: "아침형인가요, 저녁형인가요?",
    question_category: "취미",
    author_gender: "male",
    author_name: "새벽공기",
    liked_by_me: false,
  },
  {
    id: "demo-e6",
    user_id: "demo-u6",
    content: "말보다 오래 남는 건 결국 태도더라고요.",
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    question_text: "사람을 볼 때 가장 중요하게 보는 건?",
    question_category: "가치관",
    author_gender: "female",
    author_name: "빈노트",
    liked_by_me: false,
  },
  {
    id: "demo-e7",
    user_id: "demo-u7",
    content:
      "실패는 방향을 바꾸라는 신호라고 생각해요. 무너졌을 때 나를 일으킨 건 대단한 각오가 아니라, 그냥 내일 아침에도 밥을 먹고 산책을 나가는 사소한 반복이었어요. 그런 작은 리듬이 결국 다시 걷게 하더라고요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    question_text: "실패를 어떻게 대하나요?",
    question_category: "가치관",
    author_gender: "male",
    author_name: "작은등대",
    liked_by_me: false,
  },
  {
    id: "demo-e8",
    user_id: "demo-u8",
    content: "비 오는 날 창가에서 책 읽기요. 그거면 충분해요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    question_text: "혼자 있을 때 뭘 하나요?",
    question_category: "취미",
    author_gender: "female",
    author_name: "흐린날",
    liked_by_me: true,
  },
  {
    id: "demo-e9",
    user_id: "demo-u9",
    content:
      "설렘은 오래 못 가지만 편안함은 오래 가요. 그래서 요즘은 함께 있을 때 아무 말 하지 않아도 어색하지 않은 사람에게 마음이 가요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    question_text: "어떤 사람에게 끌리나요?",
    question_category: "사랑",
    author_gender: "female",
    author_name: "고요한밤",
    liked_by_me: false,
  },
  {
    id: "demo-e10",
    user_id: "demo-u10",
    content: "음악. 우울할 땐 오히려 슬픈 노래를 들어요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    question_text: "기분이 가라앉을 때 뭘 하나요?",
    question_category: "취미",
    author_gender: "male",
    author_name: "물결무늬",
    liked_by_me: false,
  },
  {
    id: "demo-e11",
    user_id: "demo-u11",
    content:
      "정직이요. 손해를 보더라도 나 자신에게 떳떳한 쪽을 택하려고 해요. 그게 결국 잠을 편하게 자는 방법이더라고요. 남을 속이는 것보다 나를 속이는 게 더 오래 괴로워요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    question_text: "가장 지키고 싶은 가치는?",
    question_category: "가치관",
    author_gender: "male",
    author_name: "조용한불빛",
    liked_by_me: false,
  },
  {
    id: "demo-e12",
    user_id: "demo-u12",
    content: "바다요. 이유는 모르겠지만 늘 마음이 넓어져요.",
    created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    question_text: "마음이 편해지는 장소가 있나요?",
    question_category: "취미",
    author_gender: "female",
    author_name: "먼바다",
    liked_by_me: false,
  },
  {
    id: "demo-e13",
    user_id: "demo-u13",
    content:
      "저는 계획을 세우는 걸 좋아해요. 여행을 가기 전 몇 주 동안 지도를 보고 동선을 짜는 그 시간이 여행만큼이나 즐거워요. 막상 가서는 다 어기지만요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    question_text: "계획형인가요, 즉흥형인가요?",
    question_category: "취미",
    author_gender: "female",
    author_name: "구름수집가",
    liked_by_me: false,
  },
  {
    id: "demo-e14",
    user_id: "demo-u14",
    content: "고맙다는 말을 자주 하는 사람이요.",
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    question_text: "닮고 싶은 사람이 있나요?",
    question_category: "가치관",
    author_gender: "male",
    author_name: "따뜻한손",
    liked_by_me: false,
  },
  {
    id: "demo-e15",
    user_id: "demo-u15",
    content:
      "어릴 땐 유명해지고 싶었는데, 지금은 조용히 잘 지내는 게 꿈이에요. 좋아하는 사람 몇 명과 오래 웃을 수 있으면 그걸로 성공한 삶이라고 생각해요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    question_text: "성공이란 뭐라고 생각하나요?",
    question_category: "가치관",
    author_gender: "male",
    author_name: "낮달",
    liked_by_me: false,
  },
  {
    id: "demo-e16",
    user_id: "demo-u16",
    content: "떡볶이요. 스트레스엔 매운 게 최고예요.",
    created_at: new Date(Date.now() - 1000 * 60 * 33).toISOString(),
    question_text: "위로가 되는 음식이 있나요?",
    question_category: "취미",
    author_gender: "female",
    author_name: "겨울딸기",
    liked_by_me: false,
  },
  {
    id: "demo-e17",
    user_id: "demo-u17",
    content:
      "사랑받는 것보다 사랑하는 게 더 어렵다는 걸 요즘 배워요. 표현하지 않으면 마음은 없는 것과 같더라고요. 그래서 서툴러도 자주 말하려고 해요, 좋아한다고.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
    question_text: "사랑에서 가장 어려운 건?",
    question_category: "사랑",
    author_gender: "female",
    author_name: "여름밤",
    liked_by_me: false,
  },
  {
    id: "demo-e18",
    user_id: "demo-u18",
    content: "산에 올라가요. 정상보다 오르는 길이 좋아서요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    question_text: "주말엔 주로 뭘 하나요?",
    question_category: "취미",
    author_gender: "male",
    author_name: "산책자",
    liked_by_me: false,
  },
  {
    id: "demo-e19",
    user_id: "demo-u19",
    content:
      "후회는 하지 않으려 해요. 그때의 나는 그게 최선이었을 테니까요. 다만 배우지 못한 건 아쉬워요. 같은 실수를 반복할 때 나 자신에게 제일 미안해져요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    question_text: "후회하는 일이 있나요?",
    question_category: "가치관",
    author_gender: "male",
    author_name: "밤하늘",
    liked_by_me: false,
  },
  {
    id: "demo-e20",
    user_id: "demo-u20",
    content: "글쓰기요. 마음이 복잡할 때 손으로 적으면 정리돼요.",
    created_at: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    question_text: "나만의 스트레스 해소법은?",
    question_category: "취미",
    author_gender: "female",
    author_name: "빈노트",
    liked_by_me: true,
  },
];

/** Explore feed: Q&A cards across all questions from other people (newest first). */
export async function getExploreFeed(viewerId: string): Promise<ExploreCard[]> {
  if (PREVIEW_MODE) return DEMO_EXPLORE;
  const supabase = createClient();
  const blocked = await blockedUserIds(viewerId);

  let query = supabase
    .from("answers")
    .select(
      "id, user_id, content, created_at, questions ( text, category ), profiles ( gender )"
    )
    .neq("user_id", viewerId)
    .order("created_at", { ascending: false })
    .limit(60);

  if (blocked.length > 0) {
    query = query.not("user_id", "in", `(${blocked.join(",")})`);
  }

  const { data } = await query;
  const rows = data ?? [];
  const liked = await likedAnswerIds(
    viewerId,
    rows.map((r) => r.id)
  );

  return rows.map((r) => {
    const q = pickQuestion(r.questions as QuestionJoin);
    return {
      id: r.id,
      user_id: r.user_id,
      content: r.content,
      created_at: r.created_at,
      question_text: q?.text ?? "질문",
      question_category: q?.category ?? "",
      author_gender: pickGender(r.profiles as ProfileJoin),
      author_name: nicknameFor(r.user_id),
      liked_by_me: liked.has(r.id),
    };
  });
}

// ---- Likes (관심) ----------------------------------------------------------

/** Cards the viewer has liked (their own outgoing likes only). */
export async function getLikedCards(viewerId: string): Promise<ExploreCard[]> {
  if (PREVIEW_MODE) {
    return DEMO_EXPLORE.filter((c) => c.liked_by_me);
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("likes")
    .select(
      "created_at, answers ( id, user_id, content, created_at, questions ( text, category ), profiles ( gender ) )"
    )
    .eq("from_user_id", viewerId)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = data ?? [];
  const cards: ExploreCard[] = [];
  for (const row of rows) {
    const a = Array.isArray(row.answers) ? row.answers[0] : row.answers;
    if (!a) continue;
    const q = pickQuestion(a.questions as QuestionJoin);
    cards.push({
      id: a.id,
      user_id: a.user_id,
      content: a.content,
      created_at: a.created_at,
      question_text: q?.text ?? "질문",
      question_category: q?.category ?? "",
      author_gender: pickGender(a.profiles as ProfileJoin),
      author_name: nicknameFor(a.user_id),
      liked_by_me: true,
    });
  }
  return cards;
}

/**
 * Authors the viewer has liked, with how many of their answers the viewer liked.
 * This counts the viewer's OWN outgoing likes — never anyone's received total.
 */
export async function getLikedAuthors(viewerId: string): Promise<LikedAuthor[]> {
  if (PREVIEW_MODE) {
    return [
      {
        user_id: "demo-u1",
        gender: "female",
        like_count: 3,
        last_liked_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
      {
        user_id: "demo-u3",
        gender: "male",
        like_count: 1,
        last_liked_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      },
    ];
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("likes")
    .select("to_user_id, created_at")
    .eq("from_user_id", viewerId)
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = data ?? [];
  const grouped = new Map<string, { count: number; last: string }>();
  for (const r of rows) {
    const cur = grouped.get(r.to_user_id);
    if (cur) cur.count += 1;
    else grouped.set(r.to_user_id, { count: 1, last: r.created_at });
  }
  const ids = [...grouped.keys()];
  if (ids.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, gender")
    .in("id", ids);
  const genderById = new Map(
    (profiles ?? []).map((p) => [p.id, p.gender as Gender | null])
  );

  return [...grouped.entries()]
    .map(([user_id, v]) => ({
      user_id,
      gender: genderById.get(user_id) ?? null,
      like_count: v.count,
      last_liked_at: v.last,
    }))
    .sort((a, b) => (a.last_liked_at < b.last_liked_at ? 1 : -1));
}

// ---- Messages (쪽지) -------------------------------------------------------

const DEMO_MESSAGES: Message[] = [
  {
    id: "demo-m1",
    body: "돈에 대한 답변, 오래 곱씹게 되네요. 저도 비슷한 생각이에요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    mine: true,
  },
  {
    id: "demo-m2",
    body: "그렇게 읽어주셔서 고마워요. 어떤 부분이 특히 와닿았어요?",
    created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    mine: false,
  },
];

/** Conversation summaries for the viewer (latest message per partner). */
export async function getConversations(viewerId: string): Promise<Conversation[]> {
  if (PREVIEW_MODE) {
    return [
      {
        partner_id: "demo-u1",
        partner_gender: "female",
        last_body: DEMO_MESSAGES[DEMO_MESSAGES.length - 1].body,
        last_at: DEMO_MESSAGES[DEMO_MESSAGES.length - 1].created_at,
        unread: true,
      },
    ];
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("messages")
    .select("from_user_id, to_user_id, body, created_at, read_at")
    .or(`from_user_id.eq.${viewerId},to_user_id.eq.${viewerId}`)
    .order("created_at", { ascending: false })
    .limit(300);

  const rows = data ?? [];
  const latest = new Map<
    string,
    { body: string; at: string; unread: boolean }
  >();
  for (const r of rows) {
    const partner = r.from_user_id === viewerId ? r.to_user_id : r.from_user_id;
    if (latest.has(partner)) continue; // rows are newest-first
    latest.set(partner, {
      body: r.body,
      at: r.created_at,
      unread: r.to_user_id === viewerId && r.read_at === null,
    });
  }

  const ids = [...latest.keys()];
  if (ids.length === 0) return [];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, gender")
    .in("id", ids);
  const genderById = new Map(
    (profiles ?? []).map((p) => [p.id, p.gender as Gender | null])
  );

  return ids.map((partner_id) => {
    const l = latest.get(partner_id)!;
    return {
      partner_id,
      partner_gender: genderById.get(partner_id) ?? null,
      last_body: l.body,
      last_at: l.at,
      unread: l.unread,
    };
  });
}

/** Full thread with one partner plus the partner's public gender. */
export async function getThread(
  viewerId: string,
  partnerId: string
): Promise<{ messages: Message[]; partnerGender: Gender | null }> {
  if (PREVIEW_MODE) {
    return { messages: DEMO_MESSAGES, partnerGender: "female" };
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("messages")
    .select("id, from_user_id, body, created_at")
    .or(
      `and(from_user_id.eq.${viewerId},to_user_id.eq.${partnerId}),` +
        `and(from_user_id.eq.${partnerId},to_user_id.eq.${viewerId})`
    )
    .order("created_at", { ascending: true })
    .limit(300);

  const messages: Message[] = (data ?? []).map((m) => ({
    id: m.id,
    body: m.body,
    created_at: m.created_at,
    mine: m.from_user_id === viewerId,
  }));

  const { data: profile } = await supabase
    .from("profiles")
    .select("gender")
    .eq("id", partnerId)
    .maybeSingle();

  return {
    messages,
    partnerGender: (profile?.gender as Gender | null) ?? null,
  };
}

