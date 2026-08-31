import type { Gender } from "@/lib/types";
import { GENDER_LABEL } from "@/lib/types";

/** Category accent within the black/white/yellow palette. */
type CategoryStyle = { dot: string; chip: string; ring: string };

const CATEGORY_STYLE: Record<string, CategoryStyle> = {
  사랑: {
    dot: "bg-clay",
    chip: "bg-clay/15 text-clay",
    ring: "from-clay to-clay-deep",
  },
  취미: {
    dot: "bg-ink-soft",
    chip: "bg-white/10 text-ink",
    ring: "from-ink-soft to-line",
  },
  가치관: {
    dot: "bg-clay",
    chip: "bg-clay/15 text-clay",
    ring: "from-clay to-clay-deep",
  },
  꿈: {
    dot: "bg-ink-soft",
    chip: "bg-white/10 text-ink",
    ring: "from-ink-soft to-line",
  },
};

const FALLBACK_STYLE: CategoryStyle = {
  dot: "bg-ink-soft",
  chip: "bg-white/10 text-ink-soft",
  ring: "from-ink-soft to-line",
};

export function categoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLE[category] ?? FALLBACK_STYLE;
}

export function genderLabel(gender: Gender | null): string {
  return gender ? GENDER_LABEL[gender] : "익명";
}

/** Short gender tag shown next to a nickname on cards. */
export function genderShort(gender: Gender | null): string {
  if (gender === "male") return "남";
  if (gender === "female") return "여";
  return "익";
}

/** A stable, face-free display nickname derived from a user id. */
const NICKNAMES = [
  "밤하늘",
  "느린산책",
  "고요한밤",
  "바다여우",
  "종이비행기",
  "새벽공기",
  "민들레",
  "달빛문장",
  "구름수집가",
  "작은등대",
  "여름밤",
  "흐린날",
  "따뜻한손",
  "빈노트",
  "물결무늬",
  "조용한불빛",
  "산책자",
  "겨울딸기",
  "먼바다",
  "낮달",
];

export function nicknameFor(userId: string): string {
  let h = 0;
  for (const c of userId) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return NICKNAMES[h % NICKNAMES.length];
}
