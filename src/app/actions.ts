"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PREVIEW_MODE } from "@/lib/session";
import { ANSWER_MAX_LENGTH, ANSWER_MIN_LENGTH } from "@/lib/types";

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export type ActionResult = { ok: boolean; error?: string };

export async function submitAnswer(
  questionId: string,
  content: string
): Promise<ActionResult> {
  const trimmed = content.trim();
  if (trimmed.length < ANSWER_MIN_LENGTH) {
    return { ok: false, error: `최소 ${ANSWER_MIN_LENGTH}자 이상 작성해 주세요.` };
  }
  if (trimmed.length > ANSWER_MAX_LENGTH) {
    return { ok: false, error: `최대 ${ANSWER_MAX_LENGTH}자까지 작성할 수 있어요.` };
  }

  if (PREVIEW_MODE) return { ok: true };

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("answers").insert({
    user_id: user.id,
    question_id: questionId,
    content: trimmed,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "오늘 질문에는 이미 답변했어요." };
    }
    return { ok: false, error: "답변을 저장하지 못했어요." };
  }

  revalidatePath("/");
  revalidatePath("/feed");
  revalidatePath("/me");
  return { ok: true };
}

export async function toggleLike(
  answerId: string,
  toUserId: string,
  liked: boolean
): Promise<ActionResult> {
  if (PREVIEW_MODE) return { ok: true };
  const { supabase, user } = await requireUser();

  if (user.id === toUserId) {
    return { ok: false, error: "내 답변에는 좋아요를 누를 수 없어요." };
  }

  if (liked) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("from_user_id", user.id)
      .eq("answer_id", answerId);
    if (error) return { ok: false, error: "좋아요를 취소하지 못했어요." };
  } else {
    const { error } = await supabase.from("likes").insert({
      from_user_id: user.id,
      to_user_id: toUserId,
      answer_id: answerId,
    });
    if (error && error.code !== "23505") {
      return { ok: false, error: "좋아요를 누르지 못했어요." };
    }
  }

  revalidatePath("/feed");
  revalidatePath("/me");
  return { ok: true };
}

export async function reportAnswer(
  answerId: string,
  targetUserId: string,
  reason: string
): Promise<ActionResult> {
  if (PREVIEW_MODE) return { ok: true };
  const { supabase, user } = await requireUser();

  if (user.id === targetUserId) {
    return { ok: false, error: "본인은 신고할 수 없어요." };
  }
  if (reason.trim().length < 2) {
    return { ok: false, error: "신고 사유를 입력해 주세요." };
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    target_user_id: targetUserId,
    answer_id: answerId,
    reason: reason.trim(),
  });

  if (error) return { ok: false, error: "신고를 접수하지 못했어요." };
  return { ok: true };
}

export async function signOut() {
  if (PREVIEW_MODE) redirect("/");
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function editAnswer(
  answerId: string,
  content: string
): Promise<ActionResult> {
  const trimmed = content.trim();
  if (trimmed.length < ANSWER_MIN_LENGTH) {
    return { ok: false, error: `최소 ${ANSWER_MIN_LENGTH}자 이상 작성해 주세요.` };
  }
  if (trimmed.length > ANSWER_MAX_LENGTH) {
    return { ok: false, error: `최대 ${ANSWER_MAX_LENGTH}자까지 작성할 수 있어요.` };
  }

  if (PREVIEW_MODE) return { ok: true };

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("answers")
    .update({ content: trimmed })
    .eq("id", answerId)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: "답변을 수정하지 못했어요." };

  revalidatePath("/");
  revalidatePath("/feed");
  revalidatePath("/me");
  return { ok: true };
}

export async function sendMessage(
  toUserId: string,
  body: string
): Promise<ActionResult> {
  const trimmed = body.trim();
  if (trimmed.length < 1) return { ok: false, error: "메시지를 입력해 주세요." };
  if (trimmed.length > 1000) {
    return { ok: false, error: "메시지가 너무 길어요." };
  }

  if (PREVIEW_MODE) return { ok: true };

  const { supabase, user } = await requireUser();
  if (user.id === toUserId) {
    return { ok: false, error: "나에게는 보낼 수 없어요." };
  }

  const { error } = await supabase.from("messages").insert({
    from_user_id: user.id,
    to_user_id: toUserId,
    body: trimmed,
  });
  if (error) return { ok: false, error: "메시지를 보내지 못했어요." };

  revalidatePath("/messages");
  revalidatePath(`/messages/${toUserId}`);
  return { ok: true };
}

export async function markConversationRead(partnerId: string): Promise<void> {
  if (PREVIEW_MODE) return;
  const { supabase, user } = await requireUser();
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("to_user_id", user.id)
    .eq("from_user_id", partnerId)
    .is("read_at", null);
}
