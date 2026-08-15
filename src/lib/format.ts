/** Character count including whitespace, matching the answer length rule. */
export function countChars(value: string): number {
  return value.trim().length;
}

/** Today's date in the server timezone as YYYY-MM-DD (used to key the daily question). */
export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Relative Korean time label for feed meta lines. */
export function relativeTime(iso: string, now = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  return new Date(iso).toISOString().slice(0, 10);
}
