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

/** A Q&A card for the explore feed: an answer shown together with its question. */
export type ExploreCard = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  question_text: string;
  question_category: string;
  author_gender: Gender | null;
  author_name: string;
  liked_by_me: boolean;
};

/** An author the viewer has liked, with how many of their answers the viewer liked. */
export type LikedAuthor = {
  user_id: string;
  gender: Gender | null;
  like_count: number;
  last_liked_at: string;
};

/** One 1:1 conversation summary (latest message with the partner). */
export type Conversation = {
  partner_id: string;
  partner_gender: Gender | null;
  last_body: string;
  last_at: string;
  unread: boolean;
};

/** A single message inside a thread, from the viewer's perspective. */
export type Message = {
  id: string;
  body: string;
  created_at: string;
  mine: boolean;
};
