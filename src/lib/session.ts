import "server-only";
import { createClient } from "@/lib/supabase/server";

/** When true, the app renders with mock data and skips auth — for local UI checks. */
export const PREVIEW_MODE = process.env.NEXT_PUBLIC_PREVIEW === "true";

export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

/** The current viewer's id: a demo id in preview mode, otherwise the auth user. */
export async function getViewerId(): Promise<string | null> {
  if (PREVIEW_MODE) return DEMO_USER_ID;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}
