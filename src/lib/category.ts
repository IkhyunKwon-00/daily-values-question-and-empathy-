import type { Gender } from "@/lib/types";
import { GENDER_LABEL } from "@/lib/types";

/** Warm accent per question category — modern, saturated chips + gradient rings. */
type CategoryStyle = { dot: string; chip: string; ring: string };

const CATEGORY_STYLE: Record<string, CategoryStyle> = {
  사랑: {
    dot: "bg-rose",
    chip: "bg-rose/12 text-rose",
    ring: "from-rose to-clay",
  },
  취미: {
    dot: "bg-sage",
    chip: "bg-sage/12 text-sage",
    ring: "from-sage to-[#8FB98A]",
  },
  가치관: {
    dot: "bg-amber",
    chip: "bg-amber/14 text-amber",
    ring: "from-amber to-clay",
  },
  꿈: {
    dot: "bg-indigo",
    chip: "bg-indigo/12 text-indigo",
    ring: "from-indigo to-rose",
  },
};

const FALLBACK_STYLE: CategoryStyle = {
  dot: "bg-ink-soft",
  chip: "bg-line/60 text-ink-soft",
  ring: "from-ink-soft to-line",
};

export function categoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLE[category] ?? FALLBACK_STYLE;
}

export function genderLabel(gender: Gender | null): string {
  return gender ? GENDER_LABEL[gender] : "익명";
}
