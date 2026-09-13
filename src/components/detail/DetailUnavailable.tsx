import Link from "next/link";
import { Ban, CircleX, FileQuestion } from "lucide-react";

type DetailState = "deleted" | "blocked" | "error";

const content = {
  deleted: {
    icon: FileQuestion,
    title: "이 생각은 더 이상 볼 수 없어요.",
    description: "작성자가 답변을 삭제했거나 공개를 멈췄어요.",
  },
  blocked: {
    icon: Ban,
    title: "차단한 사용자의 콘텐츠예요.",
    description: "이 사용자의 생각은 표시하지 않아요.",
  },
  error: {
    icon: CircleX,
    title: "생각을 불러오지 못했어요.",
    description: "잠시 후 다시 시도해주세요.",
  },
};

export default function DetailUnavailable({ state }: { state: DetailState }) {
  const item = content[state];
  const Icon = item.icon;

  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center px-5 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-paper-card text-ink-soft">
        <Icon className="h-6 w-6" />
      </span>
      <h1 className="mt-6 text-xl font-bold text-ink">{item.title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>
      <div className="mt-6 flex gap-2">
        {state === "error" && <Link href="/feed/error" className="btn-primary">다시 시도</Link>}
        <Link href="/feed" className="btn-ghost">탐색으로</Link>
      </div>
    </div>
  );
}