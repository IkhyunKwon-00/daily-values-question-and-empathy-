import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signOut } from "@/app/actions";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-[42rem]">
      <header className="sticky top-0 z-20 -mx-5 flex h-14 items-center bg-paper/90 px-4 backdrop-blur-xl sm:-mx-8 sm:px-7">
        <Link
          href="/me"
          aria-label="프로필로 돌아가기"
          className="grid h-11 w-11 place-items-center rounded-lg text-ink-soft transition hover:bg-white/[0.05] hover:text-ink"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="ml-2 text-sm font-semibold text-ink">설정</span>
      </header>

      <section className="border-b border-line/60 py-10">
        <h1 className="text-3xl font-bold text-ink">계정 설정</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          공개 프로필에는 성별과 남긴 생각만 표시됩니다.
        </p>
      </section>

      <section className="py-8">
        <form action={signOut}>
          <button type="submit" className="btn-ghost text-sm">로그아웃</button>
        </form>
      </section>
    </div>
  );
}