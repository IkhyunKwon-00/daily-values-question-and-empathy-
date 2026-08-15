export const ANSWER_MIN_LENGTH = 100;
export const ANSWER_MAX_LENGTH = 500;

export type Gender = "male" | "female" | "other";

export const GENDER_LABEL: Record<Gender, string> = {
  male: "남성",
  female: "여성",
  other: "기타",
};

export type Profile = {
  id: string;
  gender: Gender | null;
  age: number | null;
  created_at: string;
};

export type Question = {
  id: string;
  text: string;
  category: string;
  publish_date: string;
};

export type Answer = {
  id: string;
  user_id: string;
  question_id: string;
  content: string;
  created_at: string;
};

/** Answer joined with the author's public profile info and viewer-specific like state. */
export type FeedAnswer = Answer & {
  author_gender: Gender | null;
  liked_by_me: boolean;
  is_mine: boolean;
};
