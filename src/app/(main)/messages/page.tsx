import Link from "next/link";
import { getConversations } from "@/lib/data";
import { getViewerId, DEMO_USER_ID } from "@/lib/session";
import { genderLabel } from "@/lib/category";
import { relativeTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const viewerId = (await getViewerId()) ?? DEMO_USER_ID;
  const conversations = await getConversations(viewerId);

  return (
    <div className="space-y-4">
      <header className="px-1">
        <h1 className="font-voice text-3xl text-ink">쪽지</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          내면으로 이어진 대화. 얼굴 없이도 마음은 오갈 수 있어요.
        </p>
      </header>

      {conversations.length === 0 ? (
        <div className="card p-7 text-center text-sm text-ink-soft">
          아직 주고받은 쪽지가 없어요. 관심 탭에서 마음이 닿은 사람에게 먼저
          말을 건네보세요.
        </div>
      ) : (
        <ul className="space-y-3">
          {conversations.map((c) => {
            const label = genderLabel(c.partner_gender);
            return (
              <li key={c.partner_id}>
                <Link
                  href={`/messages/${c.partner_id}`}
                  className="card flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5"
                >
                  <span className="relative grid h-11 w-11 place-items-center rounded-full bg-line/60 font-mono text-sm text-ink-soft">
                    {label[0]}
                    {c.unread && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-clay" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] text-ink">{label}</p>
                      <span className="meta ml-auto shrink-0">
                        {relativeTime(c.last_at)}
                      </span>
                    </div>
                    <p
                      className={`truncate text-sm ${
                        c.unread ? "text-ink" : "text-ink-soft"
                      }`}
                    >
                      {c.last_body}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
