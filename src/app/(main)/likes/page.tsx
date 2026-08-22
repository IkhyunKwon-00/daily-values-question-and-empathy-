import Link from "next/link";
import { getLikedCards, getLikedAuthors } from "@/lib/data";
import { getViewerId, DEMO_USER_ID } from "@/lib/session";
import ExploreCard from "@/components/ExploreCard";
import LikesTabs from "@/components/LikesTabs";
import { genderLabel } from "@/lib/category";
import { relativeTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LikesPage() {
  const viewerId = (await getViewerId()) ?? DEMO_USER_ID;
  const [cards, authors] = await Promise.all([
    getLikedCards(viewerId),
    getLikedAuthors(viewerId),
  ]);

  const cardsNode =
    cards.length === 0 ? (
      <div className="card p-7 text-center text-sm text-ink-soft">
        아직 공감한 답변이 없어요. 탐색에서 마음이 머무는 생각을 찾아보세요.
      </div>
    ) : (
      <div className="space-y-4">
        {cards.map((card) => (
          <ExploreCard key={card.id} card={card} />
        ))}
      </div>
    );

  const authorsNode =
    authors.length === 0 ? (
      <div className="card p-7 text-center text-sm text-ink-soft">
        아직 공감을 남긴 사람이 없어요.
      </div>
    ) : (
      <ul className="space-y-3">
        {authors.map((a) => {
          const label = genderLabel(a.gender);
          return (
            <li
              key={a.user_id}
              className="card flex items-center gap-3 p-4"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-line/60 font-mono text-sm text-ink-soft">
                {label[0]}
              </span>
              <div className="min-w-0">
                <p className="text-[15px] text-ink">{label}</p>
                <p className="meta">
                  내가 공감 {a.like_count}번 · {relativeTime(a.last_liked_at)}
                </p>
              </div>
              <Link
                href={`/messages/${a.user_id}`}
                className="btn-ghost ml-auto text-sm"
              >
                쪽지
              </Link>
            </li>
          );
        })}
      </ul>
    );

  return (
    <div className="space-y-4">
      <header className="px-1">
        <h1 className="font-voice text-3xl text-ink">관심</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          내가 공감을 남긴 생각과 사람들이에요.
        </p>
      </header>

      <LikesTabs
        cardCount={cards.length}
        authorCount={authors.length}
        cards={cardsNode}
        authors={authorsNode}
      />
    </div>
  );
}
