import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="py-6 sm:py-10">
      <p className="text-xs font-semibold uppercase text-ink-soft">Notifications</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">알림</h1>
      <div className="mt-10 divide-y divide-line/60 border-y border-line/60">
        <Link href="/likes" className="flex items-center gap-4 py-6 text-ink transition hover:text-clay">
          <Heart className="h-5 w-5" strokeWidth={1.8} />
          <span>내가 마음을 보낸 답변 보기</span>
        </Link>
        <Link href="/messages" className="flex items-center gap-4 py-6 text-ink transition hover:text-clay">
          <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
          <span>새로운 대화 확인하기</span>
        </Link>
      </div>
    </div>
  );
}