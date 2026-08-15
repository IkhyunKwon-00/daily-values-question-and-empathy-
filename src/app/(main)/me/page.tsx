import { createClient } from "@/lib/supabase/server";
import { getMyAnswers } from "@/lib/data";
import { getViewerId, PREVIEW_MODE, DEMO_USER_ID } from "@/lib/session";
import { GENDER_LABEL, type Gender } from "@/lib/types";
import { relativeTime } from "@/lib/format";
import { signOut } from "@/app/actions";

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
            <article key={a.id} className="card p-5">
              <p className="meta mb-2 flex items-center gap-2">
                <span className="rounded-full border border-line px-2 py-0.5">
                  {a.question_category}
                </span>
                <span className="ml-auto">{relativeTime(a.created_at)}</span>
              </p>
              <p className="font-voice text-lg leading-relaxed text-ink">
                {a.question_text}
              </p>
              <p className="mt-2 whitespace-pre-wrap font-body text-[15px] leading-relaxed text-ink-soft">
                {a.content}
              </p>
              {a.has_empathy && (
                <p className="mt-3 border-t border-line pt-3 text-xs text-sage">
                  ♥ 누군가 이 답변에 공감했어요
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
