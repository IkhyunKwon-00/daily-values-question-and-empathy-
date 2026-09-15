import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMyAnswers } from "@/lib/data";
import { getViewerId, PREVIEW_MODE, DEMO_USER_ID } from "@/lib/session";
import { GENDER_LABEL, type Gender } from "@/lib/types";
import MyAnswerCard from "@/components/MyAnswerCard";

export const dynamic = "force-dynamic";

function ageGroup(age: number | null) {
  return age ? `${Math.floor(age / 10) * 10}대` : null;
}

export default async function MePage() {
  const viewerId = (await getViewerId()) ?? DEMO_USER_ID;

  let gender: Gender | null = "female";
  let age: number | null = 27;
  if (!PREVIEW_MODE) {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("gender, age")
      .eq("id", viewerId)
      .maybeSingle();
    gender = (profile?.gender as Gender | null) ?? null;
    age = profile?.age ?? null;
  }

  const answers = await getMyAnswers(viewerId);
  const profileMeta = [gender ? GENDER_LABEL[gender] : null, ageGroup(age)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <section className="border-b border-line/60 pb-10 pt-4 sm:pb-14 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-ink-soft">Profile</p>
            <h1 className="mt-3 text-3xl font-bold text-ink">프로필</h1>
          </div>
          <Link href="/settings" className="btn-ghost text-sm">
            설정
          </Link>
        </div>
        <p className="mt-7 text-sm font-semibold text-ink">
          {profileMeta || "프로필 정보 비공개"}
        </p>
        <p className="mt-4 max-w-lg font-body text-base leading-[1.8] text-ink-soft">
          매일의 질문 앞에서 솔직하게 남긴 생각들을 모아두는 곳입니다.
        </p>
      </section>

      <section className="pt-10 sm:pt-14" aria-labelledby="thoughts-heading">
        <h2 id="thoughts-heading" className="text-2xl font-bold text-ink">
          내가 남긴 생각
        </h2>
        {answers.length === 0 ? (
          <div className="border-y border-line/60 py-12 text-center text-sm text-ink-soft">
            아직 남긴 생각이 없어요. 오늘의 질문에 첫 답변을 남겨보세요.
          </div>
        ) : (
          <div className="mt-6 divide-y divide-line/60 border-y border-line/60">
            {answers.map((answer) => (
              <MyAnswerCard key={answer.id} answer={answer} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
