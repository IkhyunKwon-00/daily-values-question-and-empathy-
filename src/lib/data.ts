import "server-only";
import { createClient } from "@/lib/supabase/server";
import { todayKey } from "@/lib/format";
import { PREVIEW_MODE } from "@/lib/session";
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
    content:
      "여행은 낯선 곳에서 내가 어떤 사람인지 다시 만나는 시간이에요. 익숙한 것들이 사라진 자리에서야 진짜 취향이 보이더라고요.",
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    question_text: "어떤 여행 스타일을 좋아하나요?",
    question_category: "취미",
    author_gender: "male",
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
    liked_by_me: true,
  },
  {
    id: "demo-e3",
    user_id: "demo-u2",
    content:
      "꿈은 거창한 목표라기보다, 매일 아침 눈뜨는 이유 같은 거예요. 저는 사람들의 이야기를 오래 듣고 기록하는 사람이 되고 싶어요.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    question_text: "꿈이 뭔가요?",
    question_category: "꿈",
    author_gender: "male",
    liked_by_me: false,
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

