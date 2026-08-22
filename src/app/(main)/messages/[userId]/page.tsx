import Link from "next/link";
import { getThread } from "@/lib/data";
import { getViewerId, DEMO_USER_ID } from "@/lib/session";
import { markConversationRead } from "@/app/actions";
import MessageThread from "@/components/MessageThread";
import { genderLabel } from "@/lib/category";

export const dynamic = "force-dynamic";

export default async function ThreadPage({
  params,
}: {
  params: { userId: string };
}) {
  const viewerId = (await getViewerId()) ?? DEMO_USER_ID;
  const { messages, partnerGender } = await getThread(viewerId, params.userId);
  await markConversationRead(params.userId);

  const label = genderLabel(partnerGender);

  return (
    <div className="space-y-3">
      <header className="flex items-center gap-3 px-1">
        <Link href="/messages" className="text-ink-soft hover:text-ink" aria-label="뒤로">
          ‹
        </Link>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-line/60 font-mono text-xs text-ink-soft">
          {label[0]}
        </span>
        <div>
          <p className="text-[15px] text-ink">{label}</p>
          <p className="meta">얼굴을 모르는 채, 생각으로 이어진 사이</p>
        </div>
      </header>

      <MessageThread
        partnerId={params.userId}
        partnerLabel={label}
        messages={messages}
      />
    </div>
  );
}
