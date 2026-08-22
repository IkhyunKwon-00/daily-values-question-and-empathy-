import { createClient } from "@/lib/supabase/server";
import { getMyAnswers } from "@/lib/data";
import { getViewerId, PREVIEW_MODE, DEMO_USER_ID } from "@/lib/session";
import { GENDER_LABEL, type Gender } from "@/lib/types";
import { signOut } from "@/app/actions";
import MyAnswerCard from "@/components/MyAnswerCard";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const viewerId = (await getViewerId()) ?? DEMO_USER_ID;

  let gender: Gender | null = "female";
  if (!PREVIEW_MODE) {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("gender")
      .eq("id", viewerId)
      .maybeSingle();
    gender = (profile?.gender as Gender | null) ?? null;
  }

  const answers = await getMyAnswers(viewerId);

  return (
    <div className="space-y-4">
      <section className="card flex items-center gap-3 p-5">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-line/60 font-voice text-lg text-ink-soft">
          {gender ? GENDER_LABEL[gender][0] : "?"}
        </span>
        <div>
          <p className="font-body text-[15px] text-ink">내 기록</p>
          <p className="meta">
            {gender ? GENDER_LABEL[gender] : "성별 미설정"} · 답변 {answers.length}개
          </p>
        </div>
        <form action={signOut} className="ml-auto">
          <button type="submit" className="btn-ghost text-sm">
            로그아웃
          </button>
        </form>
      </section>

      {answers.length === 0 ? (
        <div className="card p-7 text-center text-sm text-ink-soft">
          아직 남긴 답변이 없어요. 오늘의 질문에 첫 기록을 남겨보세요.
        </div>
      ) : (
        <div className="space-y-4">
          {answers.map((a) => (
            <MyAnswerCard key={a.id} answer={a} />
          ))}
        </div>
      )}
    </div>
  );
}
