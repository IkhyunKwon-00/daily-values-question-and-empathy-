import "server-only";
import { createClient } from "@/lib/supabase/server";
import { todayKey } from "@/lib/format";
import { PREVIEW_MODE } from "@/lib/session";
import type { FeedAnswer, Gender, Question } from "@/lib/types";

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
