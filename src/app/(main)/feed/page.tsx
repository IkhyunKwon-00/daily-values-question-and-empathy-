import { getExploreFeed } from "@/lib/data";
import { getViewerId, DEMO_USER_ID } from "@/lib/session";
import ExploreFeed from "@/components/ExploreFeed";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const viewerId = (await getViewerId()) ?? DEMO_USER_ID;
  const cards = await getExploreFeed(viewerId);

  return (
    <div className="space-y-5">
      {cards.length === 0 ? (
        <div className="card p-7 text-center text-sm text-ink-soft">
          아직 둘러볼 답변이 없어요. 조금만 기다려 주세요.
        </div>
      ) : (
        <ExploreFeed cards={cards} />
      )}
    </div>
  );
}
